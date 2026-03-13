
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");
const User = require("./models/User");

const playerStats = [
  {
    identifiers: ["Rohit Sharma", "Hitman"],
    stats: {
      matches: 159,
      runs: 4231,
      highScore: 121,
      battingAvg: 32.05,
      strikeRate: 140.89,
      hundreds: 5,
      fifties: 32,
      wickets: 1,
      bestBowling: "1/6"
    }
  },
  {
    identifiers: ["Virat Kohli", "king kolhi"],
    stats: {
      matches: 125,
      runs: 4188,
      highScore: 122,
      battingAvg: 48.69,
      strikeRate: 137.04,
      hundreds: 1,
      fifties: 38,
      wickets: 4,
      bestBowling: "1/13"
    }
  },
  {
    identifiers: ["MS Dhoni", "MSD"],
    stats: {
      matches: 98,
      runs: 1617,
      highScore: 56,
      battingAvg: 37.60,
      strikeRate: 126.13,
      hundreds: 0,
      fifties: 2,
      wickets: 0,
      bestBowling: "0/0"
    }
  },
  {
    identifiers: ["kl rahul"],
    stats: {
      matches: 72,
      runs: 2265,
      highScore: 110,
      battingAvg: 37.75,
      strikeRate: 139.12,
      hundreds: 2,
      fifties: 22,
      wickets: 0,
      bestBowling: "0/0"
    }
  },
  {
    identifiers: ["Hardik pandya"],
    stats: {
      matches: 102,
      runs: 1523,
      highScore: 71,
      battingAvg: 26.71,
      strikeRate: 140.88,
      hundreds: 0,
      fifties: 4,
      wickets: 86,
      bestBowling: "4/33"
    }
  },
  {
    identifiers: ["Jasprit Bumrah"],
    stats: {
      matches: 70,
      runs: 8,
      highScore: 2,
      battingAvg: 8.00,
      strikeRate: 126.98,
      hundreds: 0,
      fifties: 0,
      wickets: 89,
      bestBowling: "3/11"
    }
  }
];

const updateStats = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
    console.log("Connected to MongoDB for comprehensive stat updates...");

    const defaultUser = await User.findOne({ isAdmin: true }) || await User.findOne({});
    if (!defaultUser) {
        console.error("No users found. Cannot update players without a valid user ID.");
        process.exit(1);
    }

    for (const update of playerStats) {
      const { identifiers, stats } = update;
      
      for (const id of identifiers) {
        const result = await Player.updateMany(
          { name: { $regex: new RegExp(`^${id}$`, "i") } },
          { 
            $set: { 
              ...stats,
              user: defaultUser._id // Ensure user is set to satisfy validation
            } 
          }
        );
        
        if (result.matchedCount > 0) {
          console.log(`Updated ${result.modifiedCount} records for id: ${id} (Matched ${result.matchedCount})`);
        }
      }
    }

    console.log("All comprehensive updates completed.");
    process.exit(0);
  } catch (err) {
    console.error("Error during comprehensive update:", err);
    process.exit(1);
  }
};

updateStats();
