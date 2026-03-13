require("dotenv").config();
const rapidapiService = require("./services/rapidapiService");

async function testMatchSync() {
    console.log("Testing RapidAPI matches...");
    try {
        const fixtures = await rapidapiService.getFixtures();

        const type = fixtures?.type;
        const matches = type === 'matches' ? fixtures.matches : (fixtures?.matches || []);

        console.log(`Found ${matches.length} fixtures total`);

        if (matches.length > 0) {
            console.log("Sample fixture:");
            console.log(JSON.stringify(matches[0], null, 2));

            const statuses = new Set(matches.map(m => m.status));
            console.log("\nUnique statuses found:", Array.from(statuses));
        }

        console.log("\nTesting RapidAPI Live Matches...");
        const liveData = await rapidapiService.getLiveScores();
        const liveMatches = liveData?.type === 'matches' ? liveData.matches : (liveData?.matches || []);

        console.log(`Found ${liveMatches.length} live matches limit`);
        if (liveMatches.length > 0) {
            console.log(JSON.stringify(liveMatches[0], null, 2));
        }
    } catch (error) {
        console.error(error)
    }
}

testMatchSync();
