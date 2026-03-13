require("dotenv").config();
const aiService = require("./services/aiService");

async function diagnose() {
    console.log("Diag: Checking aiService with GROK_API_KEY...");
    console.log("GROK_API_KEY:", process.env.GROK_API_KEY ? "Present" : "Missing");
    
    if (!process.env.GROK_API_KEY) {
        console.error("DIAG ERROR: GROK_API_KEY is not set in environment.");
        return;
    }

    try {
        console.log("Diag: Attempting non-streaming response...");
        const start = Date.now();
        const response = await aiService.generateResponse("Hello, simple test.");
        const end = Date.now();
        console.log("Diag: Response received in", end - start, "ms");
        console.log("Diag: Response length:", response ? response.length : 0);
        console.log("Diag: Response text:", response);

        console.log("\nDiag: Attempting streaming response...");
        const streamStart = Date.now();
        const stream = aiService.streamResponse("Count to 3.");
        let chunks = 0;
        for await (const chunk of stream) {
            chunks++;
            if (chunks === 1) {
                console.log("Diag: First chunk received in", Date.now() - streamStart, "ms");
            }
            process.stdout.write(chunk);
        }
        console.log("\nDiag: Stream finished. Total chunks:", chunks);
    } catch (error) {
        console.error("DIAG ERROR:", error);
    }
}

diagnose();
