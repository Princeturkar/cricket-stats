const express = require("express");
const Match = require("../models/Match");
const { protect } = require("../middleware/authMiddleware");
const cricapiService = require("../services/cricapiService");
const rapidapiService = require("../services/rapidapiService");
const { updateAllStats } = require("../utils/statsHelper");

const router = express.Router();

console.log("API Routing Configured. CricAPI Key loaded:", process.env.CRICAPI_KEY ? "YES" : "NO");

// RapidAPI Routes
router.get("/rapidapi/fixtures", protect, async (req, res) => {
  try {
    console.log("Fixtures request received");
    const response = await rapidapiService.getFixtures();
    console.log("RapidAPI response type:", typeof response);
    const fixtures = response?.type === 'matches' ? response.matches : (response?.matches || []);

    if (!fixtures.length) {
      console.log("No fixtures found in response");
      return res.json({ message: "No fixtures found", data: [] });
    }

    // Filter to only include live matches or completed matches
    const filteredFixtures = fixtures.filter(match => {
      const status = (match.status || "").toLowerCase();
      // Include statuses that indicate live or completed play
      return status.includes("live") ||
        status.includes("completed") ||
        status.includes("result") ||
        status.includes("finished") ||
        status.includes("stumps") ||
        status.includes("in progress") ||
        status.includes("won");
    });

    const syncedMatches = [];
    for (const match of filteredFixtures.slice(0, 10)) {
      try {
        const externalId = match.matchId || match.id;
        if (!externalId) continue;

        const existingMatch = await Match.findOne({ externalId });

        if (!existingMatch) {
          const newMatch = new Match({
            user: req.user._id,
            teamA: match.team1?.name || match.t1 || "Team A",
            teamB: match.team2?.name || match.t2 || "Team B",
            scoreA: match.score1 || "0/0",
            scoreB: match.score2 || "0/0",
            status: match.status || "Upcoming",
            externalId: externalId,
            externalSource: "rapidapi"
          });
          const savedMatch = await newMatch.save();
          syncedMatches.push(savedMatch);
        } else {
          existingMatch.status = match.status || existingMatch.status;
          const updated = await existingMatch.save();
          syncedMatches.push(updated);
        }
      } catch (err) {
        console.error("Error syncing individual fixture:", err.message);
      }
    }

    if (syncedMatches.length > 0) {
      await updateAllStats(req.user._id);
    }

    res.json({
      message: `Synced ${syncedMatches.length} fixtures from RapidAPI`,
      data: syncedMatches
    });
  } catch (error) {
    console.error("Fixtures sync error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/rapidapi/live-scores", protect, async (req, res) => {
  try {
    console.log("Live scores request received");
    const response = await rapidapiService.getLiveScores();
    const liveMatches = response?.type === 'matches' ? response.matches : (response?.matches || []);

    if (!liveMatches.length) {
      console.log("No live matches found in response");
      return res.json({ message: "No live matches at the moment", data: [] });
    }

    const syncedMatches = [];
    for (const match of liveMatches) {
      try {
        const externalId = match.matchId || match.id;
        if (!externalId) continue;

        const existingMatch = await Match.findOne({ externalId });

        if (!existingMatch) {
          const newMatch = new Match({
            user: req.user._id,
            teamA: match.team1?.name || match.t1 || "Team A",
            teamB: match.team2?.name || match.t2 || "Team B",
            scoreA: match.score1 || "0/0",
            scoreB: match.score2 || "0/0",
            status: "Live",
            externalId: externalId,
            externalSource: "rapidapi"
          });
          const savedMatch = await newMatch.save();
          syncedMatches.push(savedMatch);
        } else {
          existingMatch.scoreA = match.score1 || existingMatch.scoreA;
          existingMatch.scoreB = match.score2 || existingMatch.scoreB;
          existingMatch.status = "Live";
          const updated = await existingMatch.save();
          syncedMatches.push(updated);
        }
      } catch (err) {
        console.error("Error syncing live match:", err.message);
      }
    }

    if (syncedMatches.length > 0) {
      await updateAllStats(req.user._id);
    }

    res.json({
      message: `Synced ${syncedMatches.length} live matches from RapidAPI`,
      data: syncedMatches
    });
  } catch (error) {
    console.error("Live scores sync error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/rapidapi/series", protect, async (req, res) => {
  try {
    const series = await rapidapiService.getSeries();
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/rapidapi/teams", protect, async (req, res) => {
  try {
    const teams = await rapidapiService.getTeams(req.query.category);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/rapidapi/player/:playerId", protect, async (req, res) => {
  try {
    const playerDetails = await rapidapiService.getPlayerDetails(req.params.playerId);
    res.json(playerDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/rapidapi/player/search", protect, async (req, res) => {
  try {
    const players = await rapidapiService.searchPlayers(req.query.name);
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Original CricAPI Routes (Keeping for backward compatibility if needed)
router.get("/cricapi/matches", protect, async (req, res) => {
  try {
    const matches = await cricapiService.getMatches();

    if (!matches.length) {
      return res.json({ message: "No matches found", data: [] });
    }

    // Relaxed filter: include anything that isn't explicitly 'finished' or 'completed'
    // but for now, let's just include ALMOST everything to see why it's 0.
    const filteredMatches = matches.filter(match => {
      const status = (match.status || "").toLowerCase();
      // If it has a status and doesn't clearly say finished/result, include it.
      // Also include "Match starts at" which was being ignored.
      return status.includes("live") ||
        status.includes("completed") ||
        status.includes("result") ||
        status.includes("finished") ||
        status.includes("stumps") ||
        status.includes("in progress") ||
        status.includes("won") ||
        status.includes("not started") ||
        status.includes("upcoming") ||
        status.includes("starts at");
    });

    console.log(`Filtered Matches count: ${filteredMatches.length}`);

    const syncedMatches = [];
    // Sync up to 20 matches to avoid hitting rate limits or taking too long
    for (const match of filteredMatches.slice(0, 20)) {
      try {
        const externalId = (match.id || match.unique_id || "").toString();
        if (!externalId) {
          console.log("Skipping match without ID:", match.name);
          continue;
        }

        let existingMatch = await Match.findOne({ externalId });

        // Extract scores safely
        const scoreA = match.score?.[0]?.r ? `${match.score[0].r}/${match.score[0].w}` : 
                      (match.scoreA || "0/0");
        const scoreB = match.score?.[1]?.r ? `${match.score[1].r}/${match.score[1].w}` : 
                      (match.scoreB || "0/0");

        if (!existingMatch) {
          console.log(`Creating new match: ${match.name} (${externalId})`);
          existingMatch = new Match({
            user: req.user._id,
            teamA: match.teamInfo?.[0]?.name || match.teams?.[0] || "Team A",
            teamB: match.teamInfo?.[1]?.name || match.teams?.[1] || "Team B",
            scoreA,
            scoreB,
            overs: match.overs || "0.0",
            status: match.status || "Upcoming",
            externalId: externalId,
            externalSource: "cricapi"
          });
        } else {
          console.log(`Updating existing match: ${match.name} (${externalId})`);
          existingMatch.scoreA = scoreA !== "0/0" ? scoreA : existingMatch.scoreA;
          existingMatch.scoreB = scoreB !== "0/0" ? scoreB : existingMatch.scoreB;
          existingMatch.status = match.status || existingMatch.status;
        }

        const savedMatch = await existingMatch.save();
        syncedMatches.push(savedMatch);
      } catch (err) {
        console.error(`Error syncing match ${match.name || match.id}:`, err.message);
      }
    }

    if (syncedMatches.length > 0) {
      try {
        await updateAllStats(req.user._id);
      } catch (statsErr) {
        console.error("Error updating stats after sync:", statsErr.message);
      }
    }

    console.log(`Total synced matches: ${syncedMatches.length}`);

    res.json({
      message: `Synced ${syncedMatches.length} matches from CricAPI`,
      data: syncedMatches
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/cricapi/live-matches", protect, async (req, res) => {
  try {
    const liveMatches = await cricapiService.getLiveMatches();

    if (!liveMatches.length) {
      return res.json({ message: "No live matches at the moment", data: [] });
    }

    const syncedMatches = [];
    for (const match of liveMatches) {
      try {
        const externalId = (match.id || match.unique_id || "").toString();
        if (!externalId) continue;

        let existingMatch = await Match.findOne({ externalId });

        // Extract scores safely
        const scoreA = match.score?.[0]?.r ? `${match.score[0].r}/${match.score[0].w}` : 
                      (match.scoreA || "0/0");
        const scoreB = match.score?.[1]?.r ? `${match.score[1].r}/${match.score[1].w}` : 
                      (match.scoreB || "0/0");

        if (!existingMatch) {
          existingMatch = new Match({
            user: req.user._id,
            teamA: match.teamInfo?.[0]?.name || match.teams?.[0] || "Team A",
            teamB: match.teamInfo?.[1]?.name || match.teams?.[1] || "Team B",
            scoreA,
            scoreB,
            overs: match.overs || "0.0",
            status: "Live",
            externalId: externalId,
            externalSource: "cricapi"
          });
        } else {
          existingMatch.scoreA = scoreA !== "0/0" ? scoreA : existingMatch.scoreA;
          existingMatch.scoreB = scoreB !== "0/0" ? scoreB : existingMatch.scoreB;
          existingMatch.status = "Live";
        }

        const savedMatch = await existingMatch.save();
        syncedMatches.push(savedMatch);
      } catch (err) {
        console.error(`Error syncing live match ${match.name || match.id}:`, err.message);
      }
    }

    if (syncedMatches.length > 0) {
      try {
        await updateAllStats(req.user._id);
      } catch (statsErr) {
        console.error("Error updating stats after sync:", statsErr.message);
      }
    }

    res.json({
      message: `Synced ${syncedMatches.length} live matches`,
      data: syncedMatches
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/cricapi/match/:matchId", protect, async (req, res) => {
  try {
    const matchDetails = await cricapiService.getMatchDetails(req.params.matchId);

    if (!matchDetails) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json(matchDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
