require("dotenv").config();
const mongoose = require("mongoose");
const Match = require("./models/Match");
const User = require("./models/User");

const addMatches = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    let user = await User.findOne();
    if (!user) {
      console.log("❌ No user found. Please create a user first by registering in the app.");
      process.exit(1);
    }

    console.log("📝 Using user:", user.username);

    const demoMatches = [
      {
        user: user._id,
        teamA: "India",
        teamB: "Pakistan",
        scoreA: "287/6",
        scoreB: "284/8",
        overs: "50.0",
        status: "Completed",
        winner: "India",
        winType: "by wickets",
        winMargin: 2,
        manOfMatch: "Virat Kohli",
        players: [
          { name: "Virat Kohli", team: "India", role: "Batsman", runs: 98, wickets: 0, ballsFaced: 72, strikeRate: 136.1, battingAvg: 98.0 },
          { name: "Rohit Sharma", team: "India", role: "Batsman", runs: 85, wickets: 0, ballsFaced: 65, strikeRate: 130.8, battingAvg: 85.0 },
          { name: "Babar Azam", team: "Pakistan", role: "Batsman", runs: 102, wickets: 0, ballsFaced: 78, strikeRate: 130.8, battingAvg: 102.0 },
          { name: "Shaheen Afridi", team: "Pakistan", role: "Bowler", runs: 0, wickets: 2, ballsFaced: 0, strikeRate: 0, battingAvg: 0 }
        ]
      },
      {
        user: user._id,
        teamA: "Australia",
        teamB: "England",
        scoreA: "310/5",
        scoreB: "295/9",
        overs: "50.0",
        status: "Completed",
        winner: "Australia",
        winType: "by runs",
        winMargin: 15,
        manOfMatch: "Steve Smith",
        players: [
          { name: "Steve Smith", team: "Australia", role: "Batsman", runs: 121, wickets: 0, ballsFaced: 89, strikeRate: 135.96, battingAvg: 121.0 },
          { name: "David Warner", team: "Australia", role: "Batsman", runs: 95, wickets: 0, ballsFaced: 72, strikeRate: 131.9, battingAvg: 95.0 },
          { name: "Ben Stokes", team: "England", role: "All-rounder", runs: 88, wickets: 1, ballsFaced: 65, strikeRate: 135.4, battingAvg: 88.0 },
          { name: "Jofra Archer", team: "England", role: "Bowler", runs: 0, wickets: 3, ballsFaced: 0, strikeRate: 0, battingAvg: 0 }
        ]
      },
      {
        user: user._id,
        teamA: "South Africa",
        teamB: "West Indies",
        scoreA: "265/7",
        scoreB: "262/9",
        overs: "50.0",
        status: "Completed",
        winner: "South Africa",
        winType: "by wickets",
        winMargin: 1,
        manOfMatch: "Aiden Markram",
        players: [
          { name: "Aiden Markram", team: "South Africa", role: "Batsman", runs: 92, wickets: 0, ballsFaced: 68, strikeRate: 135.3, battingAvg: 92.0 },
          { name: "Temba Bavuma", team: "South Africa", role: "Batsman", runs: 78, wickets: 0, ballsFaced: 58, strikeRate: 134.5, battingAvg: 78.0 },
          { name: "Shimron Hetmyer", team: "West Indies", role: "Batsman", runs: 84, wickets: 0, ballsFaced: 62, strikeRate: 135.5, battingAvg: 84.0 },
          { name: "Romesh Shepherd", team: "West Indies", role: "Bowler", runs: 0, wickets: 2, ballsFaced: 0, strikeRate: 0, battingAvg: 0 }
        ]
      },
      {
        user: user._id,
        teamA: "Sri Lanka",
        teamB: "Bangladesh",
        scoreA: "245/8",
        scoreB: "240/9",
        overs: "50.0",
        status: "Completed",
        winner: "Sri Lanka",
        winType: "by runs",
        winMargin: 5,
        manOfMatch: "Wanindu Hasaranga",
        players: [
          { name: "Wanindu Hasaranga", team: "Sri Lanka", role: "All-rounder", runs: 76, wickets: 2, ballsFaced: 54, strikeRate: 140.7, battingAvg: 76.0 },
          { name: "Pathum Nissanka", team: "Sri Lanka", role: "Batsman", runs: 68, wickets: 0, ballsFaced: 52, strikeRate: 130.8, battingAvg: 68.0 },
          { name: "Shakib Al Hasan", team: "Bangladesh", role: "All-rounder", runs: 82, wickets: 1, ballsFaced: 61, strikeRate: 134.4, battingAvg: 82.0 },
          { name: "Mustafizur Rahman", team: "Bangladesh", role: "Bowler", runs: 0, wickets: 2, ballsFaced: 0, strikeRate: 0, battingAvg: 0 }
        ]
      },
      {
        user: user._id,
        teamA: "New Zealand",
        teamB: "Afghanistan",
        scoreA: "220/4",
        scoreB: "215/8",
        overs: "50.0",
        status: "Completed",
        winner: "New Zealand",
        winType: "by wickets",
        winMargin: 2,
        manOfMatch: "Kane Williamson",
        players: [
          { name: "Kane Williamson", team: "New Zealand", role: "Batsman", runs: 103, wickets: 0, ballsFaced: 76, strikeRate: 135.5, battingAvg: 103.0 },
          { name: "Devon Conway", team: "New Zealand", role: "Batsman", runs: 72, wickets: 0, ballsFaced: 55, strikeRate: 130.9, battingAvg: 72.0 },
          { name: "Ibrahim Zadran", team: "Afghanistan", role: "Batsman", runs: 96, wickets: 0, ballsFaced: 72, strikeRate: 133.3, battingAvg: 96.0 },
          { name: "Rashid Khan", team: "Afghanistan", role: "All-rounder", runs: 45, wickets: 1, ballsFaced: 32, strikeRate: 140.6, battingAvg: 45.0 }
        ]
      }
    ];

    // Delete existing matches
    await Match.deleteMany({ user: user._id });
    console.log("🗑️  Cleared existing matches");

    // Insert new matches
    const inserted = await Match.insertMany(demoMatches);
    console.log(`✅ Added ${inserted.length} matches with all details!`);

    inserted.forEach((match, idx) => {
      console.log(`\n📊 Match ${idx + 1}: ${match.teamA} vs ${match.teamB}`);
      console.log(`   Winner: ${match.winner} (${match.winType} ${match.winMargin})`);
      console.log(`   Man of Match: ${match.manOfMatch}`);
      console.log(`   Players: ${match.players.length}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

addMatches();
