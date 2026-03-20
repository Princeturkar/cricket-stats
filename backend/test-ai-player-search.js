const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const API_URL = 'http://localhost:5001/api';

async function testAISearch() {
    console.log("🚀 Testing AI Player Search...");
    
    // Note: This requires a valid user token. For testing purposes, we might need to login first
    // or run this logic directly in a script that has access to the database/service.
    
    // Since I can't easily get a user token here without more complex setup, 
    // I'll create a standalone script that calls the service directly.
}

// Better approach: Test the service directly
const aiService = require('./services/aiService');

async function testServiceDirectly() {
    console.log("🧪 Testing AIService.fetchPlayerFromGroq directly...");
    try {
        const playerName = "Virat Kohli";
        console.log(`Searching for: ${playerName}`);
        const data = await aiService.fetchPlayerFromGroq(playerName);
        
        if (data) {
            console.log("✅ Success! Received data:");
            console.log(JSON.stringify(data, null, 2));
            
            // Check for key fields
            const requiredFields = ['name', 'team', 'role', 'matches', 'runs'];
            const missing = requiredFields.filter(f => !data[f]);
            
            if (missing.length === 0) {
                console.log("✨ All required fields present.");
            } else {
                console.log("⚠️ Missing fields:", missing.join(', '));
            }
        } else {
            console.log("❌ Failed to fetch data. Check GROK_API_KEY.");
        }
    } catch (error) {
        console.error("💥 Test Error:", error);
    }
}

testServiceDirectly();
