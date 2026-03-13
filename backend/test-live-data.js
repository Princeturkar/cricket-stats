
const rapidapiService = require("./services/rapidapiService");
require("dotenv").config();

async function testLive() {
    console.log("Fetching recent matches from RapidAPI...");
    try {
        const matches = await rapidapiService.getFixtures();
        console.log("Matches data (first 2):");
        console.log(JSON.stringify(matches, null, 2).substring(0, 1000));
    } catch (e) {
        console.error("Failed to fetch live data:", e.message);
    }
}

testLive();
