const mongoose = require("mongoose");
const Match = require("./models/Match");
require("dotenv").config();

async function checkData() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");
    
    // Find ALL matches to see what's in there
    const matches = await Match.find({});
    console.log(`Total matches in DB: ${matches.length}`);
    
    matches.forEach((m, i) => {
      console.log(`Match ${i+1}: ${m.teamA} vs ${m.teamB} (Status: ${m.status || 'N/A'})`);
      console.log(`  - ID: ${m._id}`);
      console.log(`  - User: ${m.user}`);
      console.log(`  - Players count: ${m.players ? m.players.length : 0}`);
      
      if (m.players && m.players.length > 0) {
        m.players.forEach(p => {
          console.log(`    * ${p.name}: Runs=${p.runs}, Wkts=${p.wickets}, Team=${p.team}`);
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
