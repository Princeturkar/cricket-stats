require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: "https://api.x.ai/v1",
});

async function main() {
    try {
        const models = await openai.models.list();
        console.log("Available models:");
        models.data.forEach(m => console.log(m.id));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}
main();
