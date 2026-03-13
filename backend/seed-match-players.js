const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Match = require("./models/Match");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const generatePlayers = (team, scoreStr, winStatus) => {
    let players = [];
    const roles = ["Batsman", "Batsman", "Batsman", "Batsman", "All-rounder", "All-rounder", "Wicket-keeper", "Bowler", "Bowler", "Bowler", "Bowler"];

    // approximate runs based on team score
    let totalRuns = 0;
    if (scoreStr && scoreStr.includes('/')) {
        totalRuns = parseInt(scoreStr.split('/')[0]) || 150;
    } else {
        totalRuns = parseInt(scoreStr) || 150;
    }

    let runsLeft = totalRuns;

    for (let i = 0; i < 11; i++) {
        // distribute runs mostly to top order
        let runs = 0;
        if (i < 5) {
            runs = Math.floor(Math.random() * (runsLeft * 0.4));
        } else if (i < 8) {
            runs = Math.floor(Math.random() * (runsLeft * 0.2));
        } else {
            runs = Math.floor(Math.random() * (runsLeft * 0.05));
        }
        // randomly give a batsman a big score
        if (i === 1 || i === 2) runs += Math.floor(runsLeft * 0.2);

        if (runsLeft - runs < 0) runs = runsLeft;
        runsLeft -= runs;

        const balls = Math.floor(runs * (Math.random() * 0.5 + 0.8)); // SR approx 80-150
        const wickets = (roles[i] === "Bowler" || roles[i] === "All-rounder") ? Math.floor(Math.random() * 4) : 0;

        players.push({
            name: `${team} Player ${i + 1}`,
            team: team,
            role: roles[i],
            runs: runs,
            wickets: wickets,
            ballsFaced: balls,
            strikeRate: balls > 0 ? (runs / balls) * 100 : 0,
            battingAvg: runs
        });
    }

    players[0].runs += runsLeft; // add remainder

    return players;
};

async function seedCompletedMatches() {
    try {
        const matches = await Match.find({});
        console.log(`Found total ${matches.length} matches`);

        let updatedCount = 0;
        for (const match of matches) {
            const isCompleted = match.status && (match.status.toLowerCase().includes("won") || match.status.toLowerCase().includes("result") || match.status.toLowerCase().includes("completed"));

            if (isCompleted && (!match.players || match.players.length === 0)) {
                console.log(`Seeding players for match: ${match.teamA} vs ${match.teamB}`);

                const teamAPlayers = generatePlayers(match.teamA, match.scoreA);
                const teamBPlayers = generatePlayers(match.teamB, match.scoreB);

                await Match.updateOne(
                    { _id: match._id },
                    { $set: { players: [...teamAPlayers, ...teamBPlayers] } }
                );
                updatedCount++;
            }
        }

        console.log(`Successfully seeded players for ${updatedCount} completed matches.`);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

seedCompletedMatches();
