
require("dotenv").config();
const aiService = require("./services/aiService");

async function testRecency() {
    console.log("Testing AI's knowledge with database context...");
    const msg = "Who won the ICC Men's T20 World Cup 2024 and the Champions Trophy 2025? Mention scores if available in the database.";
    const response = await aiService.generateResponse(msg);
    console.log("\nAI Response:");
    console.log(response);
}

testRecency();
