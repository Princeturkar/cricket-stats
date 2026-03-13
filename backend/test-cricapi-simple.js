
const cricapiService = require("./services/cricapiService");
require("dotenv").config();

async function testCricAPI() {
    console.log("Fetching matches from CricAPI...");
    try {
        const matches = await cricapiService.getMatches();
        console.log("Matches data (first 2):");
        console.log(JSON.stringify(matches, null, 2).substring(0, 1000));
    } catch (e) {
        console.error("Failed to fetch CricAPI data:", e.message);
    }
}

testCricAPI();
