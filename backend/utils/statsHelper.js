const Match = require("../models/Match");
const Player = require("../models/Player");
const Team = require("../models/Team");

// Helper to update player and team aggregate stats
const updateAllStats = async (userId) => {
  try {
    const matches = await Match.find({ user: userId });
    const players = await Player.find({ user: userId });
    const teams = await Team.find({ user: userId });

    // Update Player Stats
    for (let player of players) {
      let totalRuns = 0;
      let totalWickets = 0;
      let totalMatches = 0;
      let totalBallsFaced = 0;
      let highScore = 0;
      let hundreds = 0;
      let fifties = 0;

      matches.forEach(match => {
        const performance = match.players?.find(p => 
          p.name.toLowerCase() === player.name.toLowerCase() && 
          p.team.toLowerCase() === player.team.toLowerCase()
        );

        if (performance) {
          totalMatches += 1;
          totalRuns += (performance.runs || 0);
          totalWickets += (performance.wickets || 0);
          totalBallsFaced += (performance.ballsFaced || 0);
          
          if ((performance.runs || 0) > highScore) {
            highScore = performance.runs;
          }
          if (performance.runs >= 100) {
            hundreds += 1;
          } else if (performance.runs >= 50) {
            fifties += 1;
          }
        }
      });

      player.matches = totalMatches;
      player.runs = totalRuns;
      player.wickets = totalWickets;
      player.highScore = highScore;
      player.hundreds = hundreds;
      player.fifties = fifties;
      player.strikeRate = totalBallsFaced > 0 ? (totalRuns / totalBallsFaced) * 100 : 0;
      player.battingAvg = totalMatches > 0 ? totalRuns / totalMatches : 0;

      await player.save();
    }

    // Update Team Stats (Point Table)
    for (let team of teams) {
      let played = 0;
      let won = 0;
      let lost = 0;
      let tied = 0;
      let points = 0;

      matches.forEach(match => {
        const { teamA, teamB, winner, status } = match;
        if (status === "Upcoming") return;
        
        if (teamA === team.name || teamB === team.name) {
          played += 1;
          if (winner === team.name) {
            won += 1;
            points += 2;
          } else if (winner === "Tie" || winner === "No Result" || winner === "Draw") {
            tied += 1;
            points += 1;
          } else if (winner && winner !== "TBD" && winner !== "" && winner !== "Upcoming" && winner !== "Live") {
            lost += 1;
          }
        }
      });

      team.played = played;
      team.won = won;
      team.lost = lost;
      team.tied = tied;
      team.points = points;

      await team.save();
    }
    console.log(`Stats updated for user: ${userId}`);
  } catch (error) {
    console.error("Error updating aggregate stats:", error);
  }
};

module.exports = { updateAllStats };
