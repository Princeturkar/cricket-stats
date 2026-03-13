const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const axios = require("axios");

const CRICAPI_BASE_URL = "https://api.cricapi.com/v1";
const API_KEY = process.env.CRICAPI_KEY;

async function testMatchScorecard() {
    try {
        const response = await axios.get(`${CRICAPI_BASE_URL}/matches`, {
            params: { apikey: API_KEY, offset: 0 }
        });

        const matches = response.data.data;
        if (!matches || matches.length === 0) {
            console.log("No matches found");
            return;
        }

        const completedMatches = matches.filter(m => m.matchEnded).slice(0, 5);

        for (const completedMatch of completedMatches) {
            console.log(`\n\n--- Testing Match: ${completedMatch.name} (${completedMatch.id}) ---`);
            try {
                const matchResponse = await axios.get(`${CRICAPI_BASE_URL}/match_scorecard`, {
                    params: { apikey: API_KEY, id: completedMatch.id }
                });
                console.log("Scorecard Status:", matchResponse.data.status);
                console.log("Reason:", matchResponse.data.reason);
                if (matchResponse.data.data) {
                    console.log("Scorecard Data available! Array length:", matchResponse.data.data.length);
                }
            } catch (e) {
                console.error("error /match_scorecard", e.message);
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testMatchScorecard();
