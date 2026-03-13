
const mongoose = require("mongoose");
const Match = require("./models/Match");
const User = require("./models/User");
require("dotenv").config();

async function seedRecentData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // Find a user to associate these matches with (admin or first user found)
    const user = await User.findOne({});
    if (!user) {
      console.error("No user found in database. Please register a user first.");
      process.exit(1);
    }

    const recentMatches = [
      {
        user: user._id,
        teamA: "India",
        teamB: "South Africa",
        scoreA: "176/7",
        scoreB: "169/8",
        status: "India won by 7 runs (T20 World Cup 2024 Final - June 29, 2024)",
        winner: "India",
        externalSource: "manual",
        externalId: "t20wc2024final"
      },
      {
        user: user._id,
        teamA: "India",
        teamB: "New Zealand",
        scoreA: "235/4",
        scoreB: "232/10",
        status: "India won by 4 wickets (Champions Trophy 2025 Final - March 9, 2025)",
        winner: "India",
        externalSource: "manual",
        externalId: "ct2025final"
      },
      {
        user: user._id,
        teamA: "South Africa",
        teamB: "Australia",
        scoreA: "312/5",
        scoreB: "285/10",
        status: "South Africa won by 5 wickets (WTC 2025 Final - June 2025)",
        winner: "South Africa",
        externalSource: "manual",
        externalId: "wtc2025final"
      },
      {
        user: user._id,
        teamA: "New Zealand (W)",
        teamB: "South Africa (W)",
        scoreA: "158/5",
        scoreB: "126/9",
        status: "New Zealand won by 32 runs (Women's T20 World Cup 2024 Final)",
        winner: "New Zealand",
        externalSource: "manual",
        externalId: "wt20wc2024final"
      },
      {
        user: user._id,
        teamA: "Zimbabwe",
        teamB: "Gambia",
        scoreA: "344/4",
        scoreB: "54/10",
        status: "Zimbabwe won by 290 runs (Highest T20I Score - Oct 2024)",
        winner: "Zimbabwe",
        externalSource: "manual",
        externalId: "zimrec2024"
      }
    ];

    console.log(`Seeding ${recentMatches.length} recent major matches...`);
    
    for (const matchData of recentMatches) {
        // Upsert based on externalId
        await Match.findOneAndUpdate(
            { externalId: matchData.externalId },
            matchData,
            { upsert: true, new: true }
        );
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seedRecentData();
