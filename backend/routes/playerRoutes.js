const express = require("express");
const Player = require("../models/Player");
const { protect } = require("../middleware/authMiddleware");
const aiService = require("../services/aiService");

const router = express.Router();

/**
 * @route   POST /api/players
 * @desc    Add a new player
 */
router.post("/", protect, async (req, res) => {
  console.log("Create Player Body:", req.body);
  try {
    const player = new Player({ ...req.body, user: req.user._id });
    const savedPlayer = await player.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/players/search-ai
 * @desc    Search player details using AI
 */
router.post("/search-ai", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Player name is required" });
  }

  try {
    const playerData = await aiService.fetchPlayerFromGroq(name);
    if (!playerData) {
      return res.status(500).json({ message: "AI Service returned no data. Check backend logs for Groq errors." });
    }
    res.json(playerData);
  } catch (error) {
    console.error("AI Search Error:", error);
    res.status(500).json({ message: "Internal server error during AI search" });
  }
});

/**
 * @route   GET /api/players
 * @desc    Get all players
 */
router.get("/", async (req, res) => {
  try {
    const players = await Player.find({});
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/players/team/:team
 * @desc    Get all players for a specific team
 */
router.get("/team/:team", async (req, res) => {
  try {
    const players = await Player.find({ team: req.params.team });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/players/:id
 * @desc    Get single player by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/players/:id
 * @desc    Update player
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedPlayer = await Player.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedPlayer) return res.status(404).json({ message: "Player not found" });
    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/players/:id
 * @desc    Delete player
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) return res.status(404).json({ message: "Player not found" });
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;