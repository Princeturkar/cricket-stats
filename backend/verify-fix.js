
const chatbotService = require("./services/chatbotService");
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function verifyFix() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        
        const user = await User.findOne({});
        if (!user) {
            console.error("No user found.");
            process.exit(1);
        }

        const queries = [
            "Who won the T20 World Cup 2024 final and what was the score?",
            "What happened in the Champions Trophy 2025 final?",
            "Who won the WTC 2025 final?"
        ];

        for (const query of queries) {
            console.log(`\nTesting Query: "${query}"`);
            const response = await chatbotService.processMessage(query, user._id);
            console.log("Chatbot Response:");
            console.log(response.message);
            console.log("-----------------------------------");
        }

        process.exit(0);
    } catch (err) {
        console.error("Verification error:", err);
        process.exit(1);
    }
}

verifyFix();
