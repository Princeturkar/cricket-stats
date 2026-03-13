
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // There isn't a direct listModels in the new SDK easily accessible this way in some versions
    // but we can try to see if it works
    console.log("Checking API key...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("No API key found");
        return;
    }
    
    // Just try a few common names
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    
    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`✅ Model ${modelName} works! Response: ${response.text().substring(0, 20)}...`);
            break;
        } catch (err) {
            console.log(`❌ Model ${modelName} failed: ${err.message}`);
        }
    }
  } catch (err) {
    console.error(err);
  }
}

listModels();
