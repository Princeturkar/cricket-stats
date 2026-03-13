
const axios = require("axios");
require("dotenv").config();

async function listModels() {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
        console.log("No GROK_API_KEY found in .env");
        return;
    }

    try {
        const response = await axios.get("https://api.groq.com/openai/v1/models", {
            headers: {
                "Authorization": `Bearer ${apiKey.trim()}`
            }
        });
        console.log("Available Models:");
        response.data.data.forEach(m => console.log(`- ${m.id}`));
    } catch (error) {
        console.error("Error listing Groq models:", error.response?.data || error.message);
    }
}

listModels();
