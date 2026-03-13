require("dotenv").config();
const mongoose = require("mongoose");
const Match = require("./models/Match");
const cricapiService = require("./services/cricapiService");

async function testBackendLogic() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    const matches = await cricapiService.getMatches();
    console.log(`Found ${matches.length} matches from CricAPI`);

    const filteredMatches = matches.filter(match => {
        const status = (match.status || "").toLowerCase();
        return status.includes("live") ||
            status.includes("completed") ||
            status.includes("result") ||
            status.includes("finished") ||
            status.includes("stumps") ||
            status.includes("in progress") ||
            status.includes("won");
    });

    console.log(`Filtered down to ${filteredMatches.length} matches`);

    if (filteredMatches.length > 0) {
        console.log("Sample mapped match object:");
        const match = filteredMatches[0];

        // Simulate mapping logic from routes
        const newMatch = {
            teamA: match.teamInfo?.[0]?.name || match.teams?.[0] || "Team A",
            teamB: match.teamInfo?.[1]?.name || match.teams?.[1] || "Team B",
            scoreA: match.score?.[0]?.r ? `${match.score[0].r}/${match.score[0].w}` : "0/0",
            scoreB: match.score?.[1]?.r ? `${match.score[1].r}/${match.score[1].w}` : "0/0",
            overs: match.overs || "0.0",
            status: match.status || "Upcoming",
            externalId: match.id || match.unique_id,
            externalSource: "cricapi"
        };
        console.log(JSON.stringify(newMatch, null, 2));
    }

    process.exit(0);
}

testBackendLogic().catch(console.error);
