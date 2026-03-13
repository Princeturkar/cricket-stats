const mongoose = require("mongoose");

const PlayerPerformanceSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  name: String,
  team: String,
  role: String,
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  ballsFaced: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  battingAvg: { type: Number, default: 0 }
}, { _id: false });

const MatchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teamA: String,
  teamB: String,
  scoreA: String,
  scoreB: String,
  overs: String,
  status: String,
  winner: String,
  winType: String,
  winMargin: Number,
  manOfMatch: String,
  players: [PlayerPerformanceSchema],
  externalId: String,
  externalSource: { type: String, enum: ["manual", "cricapi", "rapidapi"], default: "manual" }
}, { timestamps: true });

module.exports = mongoose.model("Match", MatchSchema);