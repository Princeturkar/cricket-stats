const mongoose = require("mongoose");
const Match = require("./models/Match");
const User = require("./models/User");
require("dotenv").config();

async function checkData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");
    
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`- ${u.username} (${u._id})`));

    const matches = await Match.find({});
    console.log(`\nTotal matches in DB: ${matches.length}`);
    
    matches.forEach((m, i) => {
      console.log(`\n[Match ${i+1}] ${m.teamA} vs ${m.teamB}`);
      console.log(`Status: ${m.status}`);
      console.log(`User: ${m.user}`);
      console.log(`Players count: ${m.players ? m.players.length : 0}`);
      
      if (m.players && m.players.length > 0) {
        m.players.forEach(p => {
          if (p.runs > 0 || p.wickets > 0) {
            console.log(`  * ${p.name}: ${p.runs} runs, ${p.wickets} wkts`);
          }
        });
      }
    });
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}
checkData();
