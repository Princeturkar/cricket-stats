require("dotenv").config();
const mongoose = require("mongoose");
const Match = require("./models/Match");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    const User = require("./models/User");
    let user = await User.findOne();
    
    if (!user) {
      console.log("No user found! Create one first.");
      process.exit(1);
    }
    
    const userId = user._id;
    console.log("Using user:", userId);
    
    await Match.deleteMany({});
    
    const wc2026Matches = [
      {
        user: userId,
        teamA: "India",
        teamB: "Pakistan",
        scoreA: "287/6",
        scoreB: "284/8",
        overs: "50.0",
        status: "Completed",
        winner: "India",
        winType: "by wickets",
        winMargin: 2,
        manOfMatch: "Virat Kohli"
      },
      {
        user: userId,
        teamA: "Australia",
        teamB: "England",
        scoreA: "310/5",
        scoreB: "295/9",
        overs: "50.0",
        status: "Completed",
        winner: "Australia",
        winType: "by runs",
        winMargin: 15,
        manOfMatch: "Steve Smith"
      },
      {
        user: userId,
        teamA: "South Africa",
        teamB: "West Indies",
        scoreA: "265/7",
        scoreB: "262/9",
        overs: "50.0",
        status: "Completed",
        winner: "South Africa",
        winType: "by wickets",
        winMargin: 1,
        manOfMatch: "Aiden Markram"
      },
      {
        user: userId,
        teamA: "Sri Lanka",
        teamB: "Bangladesh",
        scoreA: "245/8",
        scoreB: "240/9",
        overs: "50.0",
        status: "Completed",
        winner: "Sri Lanka",
        winType: "by runs",
        winMargin: 5,
        manOfMatch: "Wanindu Hasaranga"
      },
      {
        user: userId,
        teamA: "New Zealand",
        teamB: "Afghanistan",
        scoreA: "220/4",
        scoreB: "215/8",
        overs: "50.0",
        status: "Completed",
        winner: "New Zealand",
        winType: "by wickets",
        winMargin: 2,
        manOfMatch: "Kane Williamson"
      }
    ];
    
    const inserted = await Match.insertMany(wc2026Matches);
    console.log("✅ Added", inserted.length, "World Cup 2026 matches!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seed();
