const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const updatePortraits = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
    console.log("Connected to MongoDB...");

    const updates = [
        { name: /MSD/i, image: "/players/msd.png" },
        { name: /kl rahul/i, image: "/players/klrahul.png" },
        { name: /Hardik/i, image: "/players/hardik.png" }
    ];

    for (const item of updates) {
        const result = await Player.updateMany({ name: item.name }, { image: item.image });
        console.log(`Updated ${item.name}: ${result.modifiedCount} documents.`);
    }

    console.log("Portraits updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating portraits:", err);
    process.exit(1);
  }
};

updatePortraits();
