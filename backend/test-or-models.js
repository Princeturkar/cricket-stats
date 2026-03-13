require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

async function listModels() {
    try {
        const response = await openai.models.list();
        const freeModels = response.data.filter(model => model.id.includes(':free'));
        console.log("Free Models available:");
        freeModels.forEach(m => console.log(m.id));
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
