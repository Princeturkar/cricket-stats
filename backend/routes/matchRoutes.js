const express = require("express");
const Match = require("../models/Match");
const Player = require("../models/Player");
const Team = require("../models/Team");
const { protect } = require("../middleware/authMiddleware");
const { updateAllStats } = require("../utils/statsHelper");

const router = express.Router();

/**
 * @route   POST /api/matches
 * @desc    Create a new match
 */
router.post("/", protect, async (req, res) => {
  try {
    const match = new Match({ ...req.body, user: req.user._id });
    const savedMatch = await match.save();
    await updateAllStats(req.user._id);
    res.status(201).json(savedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/matches
 * @desc    Get all matches for logged in user
 */
router.get("/", protect, async (req, res) => {
  try {
    const matches = await Match.find({ user: req.user._id });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/matches/delete-all-matches
 * @desc    Delete all matches for logged in user
 */
router.post("/delete-all-matches", protect, async (req, res) => {
  try {
    const result = await Match.deleteMany({ user: req.user._id });
    console.log(`Deleted ${result.deletedCount} matches for user ${req.user._id}`);
    
    // Update player stats (will effectively reset them to 0 as there are no matches)
    await updateAllStats(req.user._id);

    res.json({ message: "All matches deleted successfully", count: result.deletedCount });
  } catch (error) {
    console.error("Error in delete-all-matches:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/matches/standings
 * @desc    Get overall standings
 */
router.get("/standings", protect, async (req, res) => {
  try {
    const matches = await Match.find({ user: req.user._id });
    const standings = {};
    
    // Stats to track
    let highestTeamScore = { score: 0, team: "", against: "", matchId: "" };
    let mostRuns = [];
    let mostWickets = [];
    let bestIndividualScore = { runs: 0, player: "", team: "", matchId: "" };
    let bestBowlingFigure = { wickets: 0, player: "", team: "", matchId: "" };

    const playerAggregates = {}; // To track most runs/wickets overall

    matches.forEach((match) => {
      const { teamA, teamB, winner, scoreA, scoreB, players, _id, status } = match;
      if (!teamA || !teamB) return;
      
      // Standings only for non-upcoming
      if (status !== "Upcoming") {
        if (!standings[teamA]) {
          standings[teamA] = { team: teamA, played: 0, won: 0, lost: 0, tied: 0, points: 0 };
        }
        if (!standings[teamB]) {
          standings[teamB] = { team: teamB, played: 0, won: 0, lost: 0, tied: 0, points: 0 };
        }

        standings[teamA].played += 1;
        standings[teamB].played += 1;

        if (winner === teamA) {
          standings[teamA].won += 1;
          standings[teamA].points += 2;
          standings[teamB].lost += 1;
        } else if (winner === teamB) {
          standings[teamB].won += 1;
          standings[teamB].points += 2;
          standings[teamA].lost += 1;
        } else if (winner === "Tie" || winner === "No Result" || winner === "Draw") {
          standings[teamA].tied += 1;
          standings[teamA].points += 1;
          standings[teamB].tied += 1;
          standings[teamB].points += 1;
        }

        // --- Team Stats: Highest Score ---
        const parseScore = (s) => parseInt(s?.split("/")[0] || 0);
        const sA = parseScore(scoreA);
        const sB = parseScore(scoreB);

        if (sA > highestTeamScore.score) {
          highestTeamScore = { score: sA, team: teamA, against: teamB, matchId: _id };
        }
        if (sB > highestTeamScore.score) {
          highestTeamScore = { score: sB, team: teamB, against: teamA, matchId: _id };
        }
      }

      // --- Player Stats: Allow any match with players to contribute ---
      if (players && Array.isArray(players)) {
        players.forEach(p => {
          if (!p.name) return;

          const r = Number(p.runs) || 0;
          const w = Number(p.wickets) || 0;

          // Individual match bests
          if (r > bestIndividualScore.runs) {
            bestIndividualScore = { runs: r, player: p.name, team: p.team, matchId: _id };
          }
          if (w > bestBowlingFigure.wickets) {
            bestBowlingFigure = { wickets: w, player: p.name, team: p.team, matchId: _id };
          }

          // Aggregates
          if (!playerAggregates[p.name]) {
            playerAggregates[p.name] = { 
              runs: 0, 
              wickets: 0, 
              matches: 0, 
              team: p.team || match.teamA || "N/A"
            };
          }
          playerAggregates[p.name].runs += r;
          playerAggregates[p.name].wickets += w;
          playerAggregates[p.name].matches += 1;
        });
      }
    });

    // Convert Aggregates to Sorted Arrays
    const playerList = Object.keys(playerAggregates).map(name => ({
      player: name,
      team: playerAggregates[name].team,
      runs: playerAggregates[name].runs,
      wickets: playerAggregates[name].wickets,
      matches: playerAggregates[name].matches
    }));

    mostRuns = playerList
      .filter(p => p.runs > 0)
      .sort((a, b) => b.runs - a.runs);
      
    mostWickets = playerList
      .filter(p => p.wickets > 0)
      .sort((a, b) => b.wickets - a.wickets);

    const sortedStandings = Object.values(standings).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.won !== a.won) return b.won - a.won;
      return a.played - b.played;
    });

    res.json({
      standings: sortedStandings,
      stats: {
        highestTeamScore,
        mostRuns,
        mostWickets,
        bestIndividualScore,
        bestBowlingFigure
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/matches/:id
 * @desc    Get match by ID
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const match = await Match.findOne({ _id: req.params.id, user: req.user._id });
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/matches/:id
 * @desc    Update live score / match details
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedMatch = await Match.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedMatch) return res.status(404).json({ message: "Match not found" });
    
    await updateAllStats(req.user._id);

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("matchUpdated", updatedMatch);

    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/matches/:id
 * @desc    Delete match
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedMatch = await Match.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedMatch) return res.status(404).json({ message: "Match not found" });
    
    await updateAllStats(req.user._id);
    
    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;