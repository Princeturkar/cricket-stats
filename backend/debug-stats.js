const mongoose = require("mongoose");
const Match = require("./models/Match");
require("dotenv").config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const matches = await Match.find({ status: { $ne: "Upcoming" } });
    console.log(`Total non-upcoming matches: ${matches.length}`);
    
    matches.forEach((m, i) => {
      console.log(`Match ${i+1}: ${m.teamA} vs ${m.teamB} (Status: ${m.status})`);
      console.log(`Players count: ${m.players ? m.players.length : 0}`);
      if (m.players && m.players.length > 0) {
        m.players.forEach(p => {
          if (p.runs > 0 || p.wickets > 0) {
            console.log(`  - ${p.name}: ${p.runs} runs, ${p.wickets} wkts`);
          }
        });
      }
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkData();
