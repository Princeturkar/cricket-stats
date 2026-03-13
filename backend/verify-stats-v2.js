
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const verifyStats = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
    const players = await Player.find({ 
      name: { $in: [/Rohit Sharma/i, /Virat Kohli/i, /kl rahul/i, /Hardik pandya/i, /Jasprit Bumrah/i, /king kolhi/i, /Hitman/i] } 
    }, { name: 1, runs: 1, wickets: 1, matches: 1 });
    
    console.log("VERIFICATION_START");
    players.forEach(p => {
      console.log(`Player: ${p.name}, Matches: ${p.matches}, Runs: ${p.runs}, Wickets: ${p.wickets}`);
    });
    console.log("VERIFICATION_END");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
verifyStats();
