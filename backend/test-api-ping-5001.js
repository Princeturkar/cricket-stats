
const axios = require('axios');

async function testApi() {
  try {
    console.log("Testing connection to http://localhost:5001/api/players...");
    const response = await axios.get('http://localhost:5001/api/players');
    console.log("Status:", response.status);
    console.log("Data count:", response.data.length);
    console.log("First player:", response.data[0]?.name || "None");
  } catch (error) {
    console.error("API test failed!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Message:", error.response.data.message);
    } else {
      console.error("Error:", error.message);
    }
  }
}

testApi();
