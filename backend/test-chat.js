
require('dotenv').config();
const mongoose = require('mongoose');
const chatbotService = require('./services/chatbotService');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const response = await chatbotService.processMessage('Who are the top performers?', '67bc33b2a7592e3535948f98'); // Using a dummy ID or real one if known
    console.log('Response:', JSON.stringify(response, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();
