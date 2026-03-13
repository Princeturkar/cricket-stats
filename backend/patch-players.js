const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const patchPlayers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
    console.log("Connected to MongoDB...");

    const players = await Player.find();
    console.log(`Found ${players.length} players to patch.`);

    for (const player of players) {
      // Randomized stats for "WOW" factor
      const hasODI = Math.random() > 0.2;
      const hasTest = Math.random() > 0.4;

      const patch = {
        nationality: player.name.includes("Kohli") || player.name.includes("Sharma") ? "Indian" : "International",
        dob: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][Math.floor(Math.random()*6)]} ${10 + Math.floor(Math.random()*20)}, ${1985 + Math.floor(Math.random()*15)}`,
        battingStyle: Math.random() > 0.7 ? "Left-handed" : "Right-handed",
        bowlingStyle: Math.random() > 0.5 ? "Right-arm Fast" : "Slow Left-arm",
        jerseyNumber: Math.floor(Math.random() * 99).toString(),
        
        // Dynamic image based on name (ui-avatars)
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random&size=512&color=fff`,

        odi: hasODI ? {
          matches: 50 + Math.floor(Math.random() * 200),
          runs: 1000 + Math.floor(Math.random() * 8000),
          avg: 35 + (Math.random() * 20),
          sr: 80 + (Math.random() * 50),
          hundreds: Math.floor(Math.random() * 30),
          fifties: Math.floor(Math.random() * 50),
          wickets: Math.floor(Math.random() * 100),
          best: `${Math.floor(Math.random()*7)}/${Math.floor(Math.random()*60)}`
        } : player.odi,

        test: hasTest ? {
          matches: 10 + Math.floor(Math.random() * 100),
          runs: 500 + Math.floor(Math.random() * 10000),
          avg: 30 + (Math.random() * 25),
          sr: 45 + (Math.random() * 25),
          hundreds: Math.floor(Math.random() * 40),
          fifties: Math.floor(Math.random() * 60),
          wickets: Math.floor(Math.random() * 400),
          best: `${Math.floor(Math.random()*10)}/${Math.floor(Math.random()*100)}`
        } : player.test
      };

      await Player.findByIdAndUpdate(player._id, patch);
      console.log(`Patched ${player.name}`);
    }

    console.log("All players patched successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error patching players:", err);
    process.exit(1);
  }
};

patchPlayers();
