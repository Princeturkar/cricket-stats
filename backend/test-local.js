const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function testLocalApi() {
    console.log("Testing local API...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB.");

    // Get any user
    const user = await User.findOne({});
    if (!user) {
        console.log("No user found.");
        process.exit(1);
    }

    // Create a token (copying auth logic)
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    console.log("Generated token, making request to http://localhost:5000/api/external/cricapi/matches");

    try {
        const res = await axios.get('http://localhost:5000/api/external/cricapi/matches', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Status:", res.status);
        console.log("Data:", JSON.stringify(res.data, null, 2));
    } catch (error) {
        console.error("API Error Object:");
        console.error(error.message);
        if (error.response) console.error(error.response.data);
    }
    process.exit(0);
}

testLocalApi();
