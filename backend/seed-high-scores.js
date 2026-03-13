
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const seedHighScores = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
    console.log("Connected to MongoDB...");

    const playersToUpdate = [
      {
        name: "Kohli|kolhi",
        updates: {
          highScore: 122, // T20I
          "odi.highScore": 183,
          "test.highScore": 254,
          "ipl.highScore": 113
        }
      },
      {
        name: "Rohit Sharma",
        updates: {
          highScore: 121, // T20I
          "odi.highScore": 264,
          "test.highScore": 212,
          "ipl.highScore": 109
        }
      }
    ];

    for (const p of playersToUpdate) {
      const result = await Player.updateOne(
        { name: { $regex: new RegExp(p.name, "i") } },
        { $set: p.updates }
      );
      console.log(`Updated ${p.name}: ${result.modifiedCount} documents.`);
    }

    console.log("High scores seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding high scores:", err);
    process.exit(1);
  }
};

seedHighScores();
