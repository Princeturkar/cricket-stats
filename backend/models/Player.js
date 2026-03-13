const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  team: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, default: "" },
  nationality: { type: String, default: "Indian" },
  dob: { type: String, default: "" },
  battingStyle: { type: String, default: "Right-handed" },
  bowlingStyle: { type: String, default: "Right-arm Fast" },
  jerseyNumber: { type: String, default: "" },
  
  // Statistics (T20I - Default/Previous fields)
  matches: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  battingAvg: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  bowlingEcon: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  bestBowling: { type: String, default: "0/0" },
  fifties: { type: Number, default: 0 },
  hundreds: { type: Number, default: 0 },

  // ODI Stats
  odi: {
    matches: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    avg: { type: Number, default: 0 },
    sr: { type: Number, default: 0 },
    hundreds: { type: Number, default: 0 },
    fifties: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    highScore: { type: Number, default: 0 },
    best: { type: String, default: "0/0" }
  },

  // Test Stats
  test: {
    matches: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    avg: { type: Number, default: 0 },
    sr: { type: Number, default: 0 },
    hundreds: { type: Number, default: 0 },
    fifties: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    highScore: { type: Number, default: 0 },
    best: { type: String, default: "0/0" }
  },

  // IPL Stats
  ipl: {
    matches: { type: Number, default: 0 },
    runs: { type: Number, default: 0 },
    avg: { type: Number, default: 0 },
    sr: { type: Number, default: 0 },
    hundreds: { type: Number, default: 0 },
    fifties: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    highScore: { type: Number, default: 0 },
    best: { type: String, default: "0/0" }
  },

  achievements: [{ type: String }],
  records: [{ type: String }],
  gallery: [{ type: String }],

  description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Player", PlayerSchema);