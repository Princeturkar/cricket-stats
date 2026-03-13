require('dotenv').config();
const OpenAI = require("openai");

async function testGrok() {
    console.log("Starting Grok API Test...");
    console.log("API Key:", process.env.GROK_API_KEY ? "Found (Starts with " + process.env.GROK_API_KEY.substring(0, 8) + "...)" : "Not Found");

    if (!process.env.GROK_API_KEY) {
        console.error("ERROR: GROK_API_KEY missing in .env");
        process.exit(1);
    }

    const openai = new OpenAI({
        apiKey: process.env.GROK_API_KEY, // The key provided is actually a Groq key (gsk_...)
        baseURL: "https://api.groq.com/openai/v1",
    });

    try {
        console.log("Sending non-streaming request to Groq...");
        const start = Date.now();
        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Hello, who are you? Answer in 5 words." }
            ],
        });
        const end = Date.now();
        console.log("Response received in", end - start, "ms");
        console.log("Response:", completion.choices[0].message.content);

        console.log("\nSending streaming request to Groq...");
        const streamStart = Date.now();
        const stream = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Count from 1 to 5. One word per line." }
            ],
            stream: true,
        });

        let firstChunk = true;
        for await (const chunk of stream) {
            if (firstChunk) {
                console.log("First chunk received in", Date.now() - streamStart, "ms");
                firstChunk = false;
            }
            process.stdout.write(chunk.choices[0]?.delta?.content || "");
        }
        console.log("\nStream finished in", Date.now() - streamStart, "ms");

    } catch (error) {
        console.error("API Error:", error.message);
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", error.response.data);
        }
    }
}

testGrok();
