require("dotenv").config();
const cricapiService = require("./services/cricapiService");

async function testMatchSync() {
    console.log("Testing CricAPI matches...");
    const matches = await cricapiService.getMatches();
    console.log(`Found ${matches.length} matches total`);

    if (matches.length > 0) {
        console.log("Sample match:");
        console.log(JSON.stringify(matches[0], null, 2));

        const statuses = new Set(matches.map(m => m.status));
        console.log("\nUnique statuses found:", Array.from(statuses));
    }

    const live = await cricapiService.getLiveMatches();
    console.log(`\nFound ${live.length} live matches limit`);
    if (live.length > 0) {
        console.log(JSON.stringify(live[0], null, 2));
    }
}

testMatchSync();
