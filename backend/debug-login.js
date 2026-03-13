const axios = require('axios');

const testLogin = async () => {
    try {
        console.log("Hitting Login API directly for Prince's email...");
        // We use a dummy password to see if the CORRECT logic handles the failure (should log TRIGGERED)
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'princeturkar1@gmail.com',
            password: 'logic_test_password' 
        });
        console.log("Response Data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.log("Status Code:", error.response.status);
            console.log("Error Response Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
};

testLogin();
