
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const seedAllStats = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
    console.log("Connected to MongoDB for roster update...");

    const rosterUpdates = [
      {
        regex: /MSD|Dhoni/i,
        name: "MS Dhoni",
        updates: {
          highScore: 56,
          "odi.highScore": 183,
          "test.highScore": 224,
          "ipl.highScore": 84
        }
      },
      {
        regex: /Rahul/i,
        name: "KL Rahul",
        updates: {
          highScore: 110,
          "odi.highScore": 112,
          "test.highScore": 199,
          "ipl.highScore": 132
        }
      },
      {
        regex: /Babar|boobzy/i,
        name: "Babar Azam",
        updates: {
          highScore: 122,
          "odi.highScore": 158,
          "test.highScore": 196,
          "ipl.highScore": 0 // Has not played IPL
        }
      },
      {
        regex: /Hardik|pandya/i,
        name: "Hardik Pandya",
        updates: {
          highScore: 71,
          "odi.highScore": 92,
          "test.highScore": 108,
          "ipl.highScore": 91
        }
      },
      {
        regex: /Bumrah/i,
        name: "Jasprit Bumrah",
        updates: {
          highScore: 8,
          "odi.highScore": 16,
          "test.highScore": 34,
          "ipl.highScore": 16
        }
      },
      {
        regex: /Rohit|Hitman/i,
        name: "Rohit Sharma",
        updates: {
          highScore: 121,
          "odi.highScore": 264,
          "test.highScore": 212,
          "ipl.highScore": 109
        }
      },
      {
        regex: /Kohli|kolhi/i,
        name: "Virat Kohli",
        updates: {
          highScore: 122,
          "odi.highScore": 183,
          "test.highScore": 254,
          "ipl.highScore": 113
        }
      }
    ];

    for (const data of rosterUpdates) {
      const result = await Player.updateMany(
        { name: { $regex: data.regex } },
        { $set: data.updates }
      );
      console.log(`Updated ${data.name}: ${result.modifiedCount} documents.`);
    }

    console.log("All player formats updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Critical error during seeding:", err);
    process.exit(1);
  }
};

seedAllStats();
