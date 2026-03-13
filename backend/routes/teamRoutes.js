const express = require("express");
const Team = require("../models/Team");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Create Team
router.post("/", protect, async (req, res) => {
  try {
    const team = new Team({ ...req.body, user: req.user._id });
    const savedTeam = await team.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all Teams for logged in user
router.get("/", protect, async (req, res) => {
  try {
    const teams = await Team.find({ user: req.user._id });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Team
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedTeam = await Team.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deletedTeam) return res.status(404).json({ message: "Team not found" });
    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;