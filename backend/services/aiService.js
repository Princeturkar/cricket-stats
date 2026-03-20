const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: (process.env.GROK_API_KEY || "dummy-key").trim(),
    baseURL: "https://api.groq.com/openai/v1",
});

class AIService {
    constructor() {
        this.model = "llama-3.3-70b-versatile";
        this.currentDate = "March 12, 2026";
    }

    async generateResponse(message, context = "") {
        try {
            if (!process.env.GROK_API_KEY) {
                return null;
            }

            const prompt = `You are an expert Cricket Knowledge Assistant. Today is ${this.currentDate}. Answer cricket-related questions with accurate, engaging, and fast responses.

${context ? `Local Database Context:\n${context}\n\n` : ""}

Guidelines:
- Use the provided Local Database Context as the primary source of truth for "recent" matches (2024-2026).
- Do NOT restrict your answers ONLY to the local database context. Actively use your broader knowledge to provide the latest, up-to-date cricket statistics, news, and records.
- If context is provided from the local database, use it as a starting point, but always supplement it with the latest global facts when relevant.
- Answer FAST: Keep responses concise, direct, and informative (2-4 sentences).
- Provide detailed, informative answers about players, teams, records, rules, history, and real-time statistics.
- Use examples and facts when possible.
- Format with emojis and clear structure for readability.
- If asking about a specific player, mention their country, role, and key achievements.
- Be conversational and engaging.
- Always provide value with every response.`;

            const completion = await openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: message }
                ],
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Groq API error:", error.message);
            return null;
        }
    }

    async analyzePlayerStats(playerStats) {
        try {
            if (!process.env.GROK_API_KEY) return null;

            const prompt = `
Analyze this cricket player's statistics and provide insights:

Player Stats: ${JSON.stringify(playerStats, null, 2)}

Provide:
1. Overall performance summary
2. Strengths and weaknesses
3. Comparison context (are these good stats?)
4. Potential areas for improvement

Keep it concise and use cricket terminology.
      `;

            const completion = await openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Groq analysis error:", error.message);
            return null;
        }
    }

    async generateMatchInsight(matchData) {
        try {
            if (!process.env.GROK_API_KEY) return null;

            const prompt = `
Provide a brief cricket match analysis:

Match: ${matchData.teamA} vs ${matchData.teamB}
Score: ${matchData.scoreA} vs ${matchData.scoreB}
Status: ${matchData.status}
Winner: ${matchData.winner || "Match ongoing"}

Provide:
1. Match summary
2. Key performance moments
3. Player performances if available

Keep it exciting and informative, like a cricket commentator would.
      `;

            const completion = await openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Groq match insight error:", error.message);
            return null;
        }
    }

    async generateQuizQuestion(difficulty = "medium", category = "general") {
        try {
            if (!process.env.GROK_API_KEY) return null;

            const difficultyLevel = difficulty.toLowerCase() === "easy" ? "beginner-friendly" :
                difficulty.toLowerCase() === "hard" ? "expert-level" : "intermediate";

            const categoryDesc = category.toLowerCase() === "players" ? "about famous cricket players and their careers" :
                category.toLowerCase() === "records" ? "about cricket records and statistics" :
                    category.toLowerCase() === "rules" ? "about cricket rules and regulations" :
                        "about general cricket facts, history, and gameplay";

            const prompt = `Generate a ${difficultyLevel} cricket quiz question ${categoryDesc}.

IMPORTANT: Return ONLY a valid JSON object with NO markdown formatting, NO code blocks, and NO extra text. The JSON must be on a single line.

{
  "question": "The actual question here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswerIndex": 0,
  "explanation": "Why this is correct",
  "difficulty": "${difficulty}",
  "category": "${category}"
}

Requirements:
- Question must be engaging and about cricket
- Exactly 4 options (A, B, C, D)
- correctAnswerIndex must be 0, 1, 2, or 3
- Explanation should be educational`;

            const completion = await openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
            });
            const text = completion.choices[0].message.content.trim();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error("Could not extract JSON from Groq response:", text);
                return null;
            }

            const parsed = JSON.parse(jsonMatch[0]);

            return {
                question: parsed.question,
                options: parsed.options,
                correctAnswer: parsed.correctAnswerIndex,
                explanation: parsed.explanation,
                difficulty: parsed.difficulty || difficulty,
                category: parsed.category || category
            };
        } catch (error) {
            console.error("Groq quiz generation error:", error.message);
            return null;
        }
    }

    async generateAnswerFeedback(question, userAnswer, correctAnswer, isCorrect) {
        try {
            if (!process.env.GROK_API_KEY) return null;

            const prompt = `
User answered a cricket quiz question.
Question: ${question}
User's Answer: ${userAnswer}
Correct Answer: ${correctAnswer}
Is Correct: ${isCorrect}

Provide constructive feedback in 1-2 sentences. If wrong, explain why the correct answer is right.
Keep it encouraging and educational.
      `;

            const completion = await openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
            });
            return completion.choices[0].message.content;
        } catch (error) {
            console.error("Groq feedback error:", error.message);
            return null;
        }
    }

    async *streamResponse(message, context = "") {
        try {
            if (!process.env.GROK_API_KEY) return;

            const prompt = `You are an expert Cricket Knowledge Assistant. Today is ${this.currentDate}. Answer cricket-related questions with accurate, engaging, and fast responses.

${context ? `Local Database Context:\n${context}\n\n` : ""}

Guidelines:
- Use the provided Local Database Context as the primary source of truth for "recent" matches (2024-2026).
- Do NOT restrict your answers ONLY to the local database context. Actively use your broader knowledge to provide the latest, up-to-date cricket statistics, news, and records.
- If context is provided from the local database, use it as a starting point, but always supplement it with the latest global facts when relevant.
- Answer FAST: Keep responses concise, direct, and informative (2-4 sentences).
- Provide detailed, informative answers about players, teams, records, rules, history, and real-time statistics.
- Use examples and facts when possible.
- Format with emojis and clear structure for readability.
- If asking about a specific player, mention their country, role, and key achievements.
- Be conversational and engaging.`;

            const stream = await openai.chat.completions.create({
                model: this.model,
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: message }
                ],
                stream: true,
            });

            for await (const chunk of stream) {
                const text = chunk.choices[0]?.delta?.content || "";
                if (text) {
                    yield text;
                }
            }
        } catch (error) {
            console.error("Groq streaming error:", error.message);
        }
    }
    async fetchPlayerFromGroq(playerName) {
        try {
            if (!process.env.GROK_API_KEY) return null;

            const prompt = `You are an expert Cricket Statistician. Fetch professional information for the cricket player: "${playerName}".
            
            IMPORTANT: Return ONLY a valid JSON object with NO markdown formatting, NO code blocks, and NO extra text.
            The JSON must match this structure exactly:
            {
              "name": "Full Name",
              "team": "Current Team or Country",
              "role": "Batsman/Bowler/All-rounder/Wicketkeeper",
              "nationality": "Country",
              "dob": "Month DD, YYYY",
              "battingStyle": "Right/Left-handed",
              "bowlingStyle": "Bowling style",
              "jerseyNumber": "Number",
              "matches": 0,
              "runs": 0,
              "wickets": 0,
              "battingAvg": 0.0,
              "strikeRate": 0.0,
              "bowlingEcon": 0.0,
              "highScore": 0,
              "bestBowling": "W/R",
              "fifties": 0,
              "hundreds": 0,
              "odi": { "matches": 0, "runs": 0, "avg": 0, "sr": 0, "hundreds": 0, "fifties": 0, "wickets": 0, "highScore": 0, "best": "W/R" },
              "test": { "matches": 0, "runs": 0, "avg": 0, "sr": 0, "hundreds": 0, "fifties": 0, "wickets": 0, "highScore": 0, "best": "W/R" },
              "ipl": { "matches": 0, "runs": 0, "avg": 0, "sr": 0, "hundreds": 0, "fifties": 0, "wickets": 0, "highScore": 0, "best": "W/R" },
              "description": "Brief professional summary"
            }

            If data is unavailable for a specific field, use appropriate defaults: 0 for numbers, "" for strings, and "0/0" for best bowling.
            Use the latest available data as of ${this.currentDate}.`;

            const completion = await openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });

            const text = completion.choices[0].message.content.trim();
            return JSON.parse(text);
        } catch (error) {
            console.error("Groq fetch player error:", error.message);
            return null;
        }
    }
}

module.exports = new AIService();
