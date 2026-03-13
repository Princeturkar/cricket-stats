require('dotenv').config();
const aiService = require('./services/aiService');

async function testOpenRouter() {
    console.log("Testing OpenRouter API connection...");
    try {
        const response = await aiService.generateResponse("Who won the 2011 ICC Cricket World Cup?");
        console.log("\n✅ OpenRouter Response:\n");
        console.log(response);
    } catch (error) {
        console.error("❌ Error testing OpenRouter API:", error);
    }
}

testOpenRouter();
