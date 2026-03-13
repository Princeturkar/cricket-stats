const Match = require("../models/Match");
const Player = require("../models/Player");
const aiService = require("./aiService");

class ChatbotService {
  async processMessage(message, userId) {
    const input = message.toLowerCase().trim();

    try {
      // Get context from database
      const { context } = await this.getRelevantData(input, userId);

      // Try AI first for all cricket-related questions with context
      const aiResponse = await aiService.generateResponse(message, context);

      if (aiResponse && !aiResponse.toLowerCase().includes("not available in the local database")) {
        return {
          type: "text",
          message: aiResponse,
          powered_by: "Groq (Llama 3.3)"
        };
      }

      // Fallback to basic responses if AI is not available
      // Player stats queries
      if (this.isPlayerQuery(input)) {
        return await this.getPlayerInfo(input, userId);
      }

      // Match queries
      if (this.isMatchQuery(input)) {
        return await this.getMatchInfo(input, userId);
      }

      // Team queries
      if (this.isTeamQuery(input)) {
        return await this.getTeamInfo(input, userId);
      }

      // Statistics queries
      if (this.isStatsQuery(input)) {
        return await this.getStatistics(input, userId);
      }

      // Help/greeting
      if (this.isGreeting(input)) {
        return this.getGreeting();
      }

      return {
        type: "text",
        message: "I can help you with: player stats, match results, team performance, and cricket statistics. Try asking me about a player or match!",
        suggestions: [
          "Show Virat Kohli stats",
          "India vs Pakistan results",
          "List all teams",
          "Top performers today"
        ]
      };
    } catch (error) {
      console.error("Chatbot error:", error);
      return { type: "error", message: "Sorry, I encountered an error. Please try again." };
    }
  }

  async getRelevantData(message, userId) {
    try {
      const input = message.toLowerCase();
      // Fetch everything in parallel for maximum speed
      const [totalMatches, totalPlayers, recentMatches, samplePlayers] = await Promise.all([
        Match.countDocuments({ user: userId }),
        Player.countDocuments({ user: userId }),
        Match.find({ user: userId }).sort({ createdAt: -1 }).limit(10).lean(),
        Player.find({ user: userId }).limit(8).lean()
      ]);

      let context = "User's Cricket Database Summary:\n";
      context += `Total Matches: ${totalMatches}, Total Players: ${totalPlayers}\n`;

      if (samplePlayers.length > 0) {
        context += "Sample Players in DB: " + samplePlayers.map(p => `${p.name} (${p.team})`).join(", ") + "\n";
      }

      if (recentMatches.length > 0) {
        context += "Most Recent/Relevant Matches from DB:\n";
        recentMatches.forEach(m => {
          context += `- ${m.teamA} vs ${m.teamB}: ${m.scoreA}-${m.scoreB} (${m.status})\n`;
        });
      }

      // Special handling for specific years
      if (input.includes("2024") || input.includes("2025") || input.includes("recent")) {
          const yearMatches = await Match.find({ 
              user: userId,
              status: { $regex: new RegExp(input.includes("2024") ? "2024" : "2025", "i") }
          }).limit(5).lean();
          
          if (yearMatches.length > 0) {
              context += "\nSpecific Year Matches Found:\n";
              yearMatches.forEach(m => {
                  context += `- ${m.teamA} vs ${m.teamB}: ${m.scoreA}-${m.scoreB} (${m.status})\n`;
              });
          }
      }

      return {
        context,
        data: { matches: recentMatches, players: samplePlayers }
      };
    } catch (error) {
      console.error("Error getting relevant data:", error);
      return { context: "", data: {} };
    }
  }

  isPlayerQuery(input) {
    return /player|stats|performance|average|runs|wickets|kohli|smith|babar|kane|rashid|hasaranga/i.test(input);
  }

  isMatchQuery(input) {
    return /match|played|result|won|lost|score|versus|vs|game/i.test(input);
  }

  isTeamQuery(input) {
    return /team|india|pakistan|australia|england|zealand|sri|bangladesh|afghanistan|west|south|africa/i.test(input);
  }

  isStatsQuery(input) {
    return /total|statistics|summary|performance|best|top|highest|lowest|average/i.test(input);
  }

  isGreeting(input) {
    return /^(hi|hello|hey|help)$/i.test(input);
  }

  getGreeting() {
    return {
      type: "greeting",
      message: "👋 Hello! I'm your Cricket Stats Assistant. I can help you find player statistics, match results, team performance, and more. What would you like to know?",
      suggestions: [
        "Show player stats",
        "List recent matches",
        "Team performance",
        "Man of the match"
      ]
    };
  }

  async getPlayerInfo(input, userId) {
    try {
      // Extract player name from query
      const playerName = this.extractPlayerName(input);

      if (!playerName) {
        // List all players
        const players = await Player.find({ user: userId }).limit(10);
        if (players.length === 0) {
          return {
            type: "text",
            message: "No players found. Add some players to your database first!"
          };
        }

        const playerList = players.map(p => `${p.name} (${p.team})`).join(", ");
        return {
          type: "text",
          message: `📊 Players in your database:\n${playerList}`
        };
      }

      // Get specific player from matches
      const matches = await Match.find({ user: userId });
      const playerData = [];

      matches.forEach(match => {
        if (match.players) {
          match.players.forEach(player => {
            if (player.name.toLowerCase().includes(playerName.toLowerCase())) {
              playerData.push({
                ...player,
                matchTeamA: match.teamA,
                matchTeamB: match.teamB
              });
            }
          });
        }
      });

      if (playerData.length === 0) {
        return {
          type: "text",
          message: `No data found for player "${playerName}". Try another name!`
        };
      }

      // Calculate stats
      const stats = this.calculatePlayerStats(playerData);
      const message = `
📈 **${playerData[0].name}** (${playerData[0].role})
━━━━━━━━━━━━━━━━━━━
🏏 Total Matches: ${playerData.length}
🔴 Total Runs: ${stats.totalRuns}
📍 Batting Average: ${stats.battingAvg.toFixed(2)}
⚡ Strike Rate: ${stats.strikeRate.toFixed(2)}
🎯 Total Wickets: ${stats.totalWickets}
🔔 Matches in Database: ${playerData.length}
      `;

      return {
        type: "stats",
        message: message.trim(),
        data: stats
      };
    } catch (error) {
      return { type: "error", message: "Error fetching player information" };
    }
  }

  async getMatchInfo(input, userId) {
    try {
      const matches = await Match.find({ user: userId });

      if (matches.length === 0) {
        return { type: "text", message: "No matches found. Add some matches first!" };
      }

      // Check if asking for specific match
      const teamMatch = this.extractTeamName(input);
      let relevantMatches = matches;

      if (teamMatch) {
        relevantMatches = matches.filter(m =>
          m.teamA.toLowerCase().includes(teamMatch) ||
          m.teamB.toLowerCase().includes(teamMatch)
        );
      }

      if (relevantMatches.length === 0) {
        return { type: "text", message: `No matches found for "${teamMatch}"` };
      }

      let message = "🏏 **Match Results**\n━━━━━━━━━━━━━━━━━━━\n";
      relevantMatches.forEach(match => {
        message += `\n${match.teamA} vs ${match.teamB}\n`;
        message += `📊 Score: ${match.scoreA} | ${match.scoreB}\n`;
        message += `🏆 Winner: ${match.winner || "TBD"}\n`;
        message += `⏱️  Status: ${match.status}\n`;
      });

      return {
        type: "text",
        message: message.trim()
      };
    } catch (error) {
      return { type: "error", message: "Error fetching match information" };
    }
  }

  async getTeamInfo(input, userId) {
    try {
      const matches = await Match.find({ user: userId });
      const teams = new Set();
      const teamStats = {};

      matches.forEach(match => {
        teams.add(match.teamA);
        teams.add(match.teamB);

        if (!teamStats[match.teamA]) {
          teamStats[match.teamA] = { played: 0, won: 0, lost: 0, players: new Set() };
        }
        if (!teamStats[match.teamB]) {
          teamStats[match.teamB] = { played: 0, won: 0, lost: 0, players: new Set() };
        }

        teamStats[match.teamA].played++;
        teamStats[match.teamB].played++;

        if (match.winner === match.teamA) teamStats[match.teamA].won++;
        if (match.winner === match.teamB) teamStats[match.teamB].won++;

        if (match.players) {
          match.players.forEach(p => {
            if (p.team === match.teamA) teamStats[match.teamA].players.add(p.name);
            if (p.team === match.teamB) teamStats[match.teamB].players.add(p.name);
          });
        }
      });

      let message = "🏟️ **Team Statistics**\n━━━━━━━━━━━━━━━━━━━\n";
      Array.from(teams).forEach(team => {
        const stats = teamStats[team];
        message += `\n${team}\n`;
        message += `📊 Matches: ${stats.played}\n`;
        message += `✅ Won: ${stats.won}\n`;
        message += `❌ Lost: ${stats.lost}\n`;
        message += `👥 Players: ${stats.players.size}\n`;
      });

      return {
        type: "text",
        message: message.trim()
      };
    } catch (error) {
      return { type: "error", message: "Error fetching team information" };
    }
  }

  async getStatistics(input, userId) {
    try {
      const matches = await Match.find({ user: userId });

      if (matches.length === 0) {
        return { type: "text", message: "No matches to analyze yet!" };
      }

      // Calculate top performers
      const playerRuns = {};
      const playerWickets = {};

      matches.forEach(match => {
        if (match.players) {
          match.players.forEach(player => {
            if (!playerRuns[player.name]) playerRuns[player.name] = 0;
            if (!playerWickets[player.name]) playerWickets[player.name] = 0;
            playerRuns[player.name] += player.runs || 0;
            playerWickets[player.name] += player.wickets || 0;
          });
        }
      });

      const topBatsmen = Object.entries(playerRuns)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const topBowlers = Object.entries(playerWickets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      let message = "📊 **Overall Statistics**\n━━━━━━━━━━━━━━━━━━━\n\n";
      message += `📈 Total Matches: ${matches.length}\n`;
      message += `✅ Completed: ${matches.filter(m => m.status === "Completed").length}\n`;
      message += `🔴 Live: ${matches.filter(m => m.status === "Live").length}\n`;
      message += `⏳ Upcoming: ${matches.filter(m => m.status === "Upcoming").length}\n\n`;

      message += "🥇 **Top 5 Batsmen**\n";
      topBatsmen.forEach((entry, idx) => {
        message += `${idx + 1}. ${entry[0]}: ${entry[1]} runs\n`;
      });

      message += "\n🎯 **Top 5 Bowlers**\n";
      topBowlers.forEach((entry, idx) => {
        message += `${idx + 1}. ${entry[0]}: ${entry[1]} wickets\n`;
      });

      return {
        type: "text",
        message: message.trim()
      };
    } catch (error) {
      return { type: "error", message: "Error calculating statistics" };
    }
  }

  extractPlayerName(input) {
    const keywords = ["kohli", "smith", "babar", "kane", "rashid", "hasaranga", "warner", "stokes", "williamson", "azam"];
    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    return null;
  }

  extractTeamName(input) {
    const teams = ["india", "pakistan", "australia", "england", "zealand", "sri", "bangladesh", "afghanistan", "west", "south"];
    for (const team of teams) {
      if (input.includes(team)) {
        return team.charAt(0).toUpperCase() + team.slice(1);
      }
    }
    return null;
  }

  calculatePlayerStats(playerData) {
    const totalRuns = playerData.reduce((sum, p) => sum + (p.runs || 0), 0);
    const totalWickets = playerData.reduce((sum, p) => sum + (p.wickets || 0), 0);
    const totalBallsFaced = playerData.reduce((sum, p) => sum + (p.ballsFaced || 0), 0);

    return {
      totalRuns,
      totalWickets,
      battingAvg: playerData.length > 0 ? totalRuns / playerData.length : 0,
      strikeRate: totalBallsFaced > 0 ? (totalRuns / totalBallsFaced) * 100 : 0,
      matches: playerData.length
    };
  }
}

module.exports = new ChatbotService();
