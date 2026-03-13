const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const updateRohitPortrait = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
    console.log("Connected to MongoDB...");

    const result = await Player.updateMany({ name: /Rohit Sharma/i }, { image: "/players/rohit.png" });
    console.log(`Updated Rohit Sharma: ${result.modifiedCount} documents.`);

    console.log("Rohit Sharma portrait updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating Rohit portrait:", err);
    process.exit(1);
  }
};

updateRohitPortrait();
