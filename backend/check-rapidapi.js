const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const axios = require("axios");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

console.log("Testing RapidAPI Connection...");
console.log("Host:", RAPIDAPI_HOST);
console.log("Key:", RAPIDAPI_KEY ? "Present" : "Missing");

const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST
  }
};

async function testApi() {
  try {
    // Try different common endpoints for this host
    const endpoints = ['/fixtures', '/live', '/matches'];
    let success = false;
    
    for (const endpoint of endpoints) {
      const url = `https://${RAPIDAPI_HOST}${endpoint}`;
      console.log("Testing URL:", url);
      try {
        const response = await axios.get(url, options);
        console.log(`SUCCESS on ${endpoint}!`);
        console.log("Response Data Structure:", JSON.stringify(response.data, null, 2).substring(0, 500) + "...");
        success = true;
        break;
      } catch (e) {
        console.log(`Failed on ${endpoint}: ${e.message}`);
      }
    }
    
    if (!success) console.error("FAILED ALL ENDPOINTS");
  } catch (error) {
    console.error("FAILURE!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
  }
}

testApi();
