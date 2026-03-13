const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const updateViratPortrait = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
    console.log("Connected to MongoDB...");

    // Updating both "Virat Kohli" and "king kolhi" variations
    const result = await Player.updateMany(
      { name: { $regex: /Kohli|kolhi/i } }, 
      { image: "/players/virat.png" }
    );
    console.log(`Updated Virat Kohli: ${result.modifiedCount} documents.`);

    console.log("Virat Kohli portrait updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating Virat portrait:", err);
    process.exit(1);
  }
};

updateViratPortrait();
