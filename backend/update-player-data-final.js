const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Player = require("./models/Player");

const updateData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cricket_stats");
        console.log("Connected to MongoDB for final data enrichment...");

        const playersData = [
            {
                match: /Kohli|kolhi/i,
                data: {
                    jerseyNumber: "18",
                    nationality: "Indian",
                    dob: "Nov 05, 1988",
                    battingStyle: "Right-handed",
                    bowlingStyle: "Right-arm Medium",
                    matches: 125, runs: 4188, battingAvg: 48.69, strikeRate: 137.04, hundreds: 1, fifties: 38, wickets: 4, bestBowling: "1/13",
                    odi: { matches: 295, runs: 13848, avg: 58.18, sr: 93.59, hundreds: 50, fifties: 72, wickets: 5, best: "1/15" },
                    test: { matches: 113, runs: 8848, avg: 49.15, sr: 55.56, hundreds: 29, fifties: 30, wickets: 0, best: "0/0" },
                    achievements: ["ICC Player of the Decade (2010s)", "ICC ODI Player of the Year (2012, 2017, 2018, 2023)", "Polly Umrigar Award (5 times)"],
                    records: ["Most Centuries in ODI History (50)", "Fastest to 10,000, 11,000, 12,000 ODI runs", "Highest run-getter in T20I History"],
                    description: "Virat Kohli is often regarded as one of the greatest batsmen in the history of the sport. Known for his aggressive style and chase mastery, he led the Indian team across all formats."
                }
            },
            {
                match: /MSD/i,
                data: {
                    jerseyNumber: "7",
                    nationality: "Indian",
                    dob: "Jul 07, 1981",
                    battingStyle: "Right-handed",
                    bowlingStyle: "Right-arm Medium",
                    matches: 98, runs: 1617, battingAvg: 37.60, strikeRate: 126.13, hundreds: 0, fifties: 2, wickets: 0, bestBowling: "0/0",
                    odi: { matches: 350, runs: 10773, avg: 50.57, sr: 87.56, hundreds: 10, fifties: 73, wickets: 1, best: "1/14" },
                    test: { matches: 90, runs: 4876, avg: 38.09, sr: 59.11, hundreds: 6, fifties: 33, wickets: 0, best: "0/0" },
                    achievements: ["ICC World Cup Winner (2011)", "ICC Champions Trophy Winner (2013)", "T20 World Cup Winner (2007)", "Padma Bhushan"],
                    records: ["Only Captain to win all 3 ICC Trophies", "Most Stumpings in International Cricket", "Fastest Stumping in Cricket History (0.08s)"],
                    description: "Mahendra Singh Dhoni, the former captain of the Indian national team, is celebrated for his lightning-fast wicketkeeping and finishing abilities. 'Captain Cool' is known for his tactical genius."
                }
            },
            {
                match: /Rohit|Hitman/i,
                data: {
                    jerseyNumber: "45",
                    nationality: "Indian",
                    dob: "Apr 30, 1987",
                    battingStyle: "Right-handed",
                    bowlingStyle: "Right-arm Offbreak",
                    matches: 159, runs: 4231, battingAvg: 32.05, strikeRate: 140.89, hundreds: 5, fifties: 32, wickets: 1, bestBowling: "1/5",
                    odi: { matches: 265, runs: 10866, avg: 49.12, sr: 92.43, hundreds: 31, fifties: 57, wickets: 8, best: "2/27" },
                    test: { matches: 61, runs: 4270, avg: 43.57, sr: 56.54, hundreds: 12, fifties: 18, wickets: 2, best: "1/0" },
                    achievements: ["ICC ODI Player of the Year (2019)", "Khel Ratna Award (2020)", "World Cup Winner (2007 T20, 2024 T20)"],
                    records: ["Highest Individual Score in ODI (264)", "Most Double Centuries in ODI (3)", "Most Sixes in International Cricket"],
                    description: "Rohit Sharma, the current captain of the Indian team, is famed for his elegant strokeplay and ability to hit massive sixes. The only player with three ODI double hundreds."
                }
            },
            {
                match: /kl rahul/i,
                data: {
                    jerseyNumber: "1",
                    nationality: "Indian",
                    dob: "Apr 18, 1992",
                    battingStyle: "Right-handed",
                    bowlingStyle: "Right-arm Medium",
                    matches: 72, runs: 2265, battingAvg: 37.75, strikeRate: 139.12, hundreds: 2, fifties: 22, wickets: 0, bestBowling: "0/0",
                    odi: { matches: 75, runs: 2851, avg: 50.02, sr: 87.50, hundreds: 7, fifties: 18, wickets: 0, best: "0/0" },
                    test: { matches: 50, runs: 2863, avg: 34.08, sr: 51.98, hundreds: 8, fifties: 14, wickets: 0, best: "0/0" },
                    achievements: ["Cricketer of the Year (Domestic)", "Asia Cup Winner"],
                    records: ["First Indian to score century on ODI debut", "Fastest IPL Fifty (14 balls)"],
                    description: "KL Rahul is a versatile top-order batsman and a reliable wicketkeeper-batsman. He is known for his technical sound batting and adaptability across formats."
                }
            },
            {
                match: /Hardik/i,
                data: {
                    jerseyNumber: "33",
                    nationality: "Indian",
                    dob: "Oct 11, 1993",
                    battingStyle: "Right-handed",
                    bowlingStyle: "Right-arm Fast-medium",
                    matches: 102, runs: 1523, battingAvg: 26.71, strikeRate: 141.01, hundreds: 0, fifties: 3, wickets: 86, bestBowling: "4/33",
                    odi: { matches: 86, runs: 1769, avg: 34.01, sr: 110.35, hundreds: 0, fifties: 11, wickets: 84, best: "4/24" },
                    test: { matches: 11, runs: 532, avg: 31.29, sr: 73.88, hundreds: 1, fifties: 4, wickets: 17, best: "3/28" },
                    achievements: ["T20 World Cup Winner (2024)", "ICC Champions Trophy Finalist", "IPL Winning Captain"],
                    records: ["Fastest Indian to 1000 T20I runs", "Best bowling figures in a T20I playoff"],
                    description: "Hardik Pandya is India's premier all-rounder, known for his explosive power-hitting and crucial breakthroughs with the ball. He provides the vital balance to the squad."
                }
            }
        ];

        for (const player of playersData) {
            const result = await Player.updateMany({ name: player.match }, player.data);
            console.log(`Updated data for ${player.match}: ${result.modifiedCount} documents.`);
        }

        console.log("All essential player data updated accurately!");
        process.exit(0);
    } catch (err) {
        console.error("Error during final data migration:", err);
        process.exit(1);
    }
};

updateData();
