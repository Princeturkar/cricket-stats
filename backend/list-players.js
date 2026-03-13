
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const listPlayers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
    const players = await Player.find({}, { name: 1, team: 1 });
    console.log("PLAYERS_LIST_START");
    players.forEach(p => console.log(`${p.name} (${p.team})`));
    console.log("PLAYERS_LIST_END");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
listPlayers();
