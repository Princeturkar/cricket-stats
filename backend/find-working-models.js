
require('dotenv').config();
const https = require('https');

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const models = JSON.parse(data).models;
    const workingModels = models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
    console.log('Working Models:', workingModels.map(m => m.name).join(', '));
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
