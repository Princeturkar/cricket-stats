
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const playerStats = [
  {
    identifiers: ["Rohit Sharma", "Hitman"],
    stats: {
      matches: 159,
      runs: 4231,
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
      battingAvg: 48.69,
      strikeRate: 137.04,
      hundreds: 1,
      fifties: 38,
      wickets: 4,
      bestBowling: "1/13"
    }
  },
  {
    identifiers: ["kl rahul"],
    stats: {
      matches: 72,
      runs: 2265,
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
    console.log("Connected to MongoDB for stat updates...");

    const User = require("./models/User");
    const defaultUser = await User.findOne({ isAdmin: true }) || await User.findOne({});
    
    if (!defaultUser) {
        console.error("No users found in database. Cannot update players with required user field.");
        process.exit(1);
    }

    for (const update of playerStats) {
      const { identifiers, stats } = update;
      
      let player = null;
      for (const id of identifiers) {
        player = await Player.findOne({ name: { $regex: new RegExp(`^${id}$`, "i") } });
        if (player) break;
      }

      if (player) {
        console.log(`Updating stats for: ${player.name}`);
        
        // If player is missing user, assign the default user
        if (!player.user) {
            player.user = defaultUser._id;
        }

        // Apply stats
        Object.assign(player, stats);
        
        // Save (this will still trigger validation, but now we have a user)
        await player.save();
        console.log(`Successfully updated ${player.name}`);
      } else {
        console.warn(`Could not find player: ${identifiers.join("/")}`);
      }
    }

    console.log("All updates completed.");
    process.exit(0);
  } catch (err) {
    console.error("Error updating player stats:", err);
    process.exit(1);
  }
};

updateStats();
