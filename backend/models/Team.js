const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  coach: { type: String, default: "" },
  established: { type: Number },
  logoUrl: { type: String, default: "" },
  played: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  lost: { type: Number, default: 0 },
  tied: { type: Number, default: 0 },
  points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Team", TeamSchema);