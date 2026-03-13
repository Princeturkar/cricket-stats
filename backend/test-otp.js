require("dotenv").config();
const sendEmail = require("./services/emailService");

const testEmail = async () => {
  try {
    console.log("Testing email sending...");
    console.log("Using EMAIL_USER:", process.env.EMAIL_USER);
    
    await sendEmail({
      email: process.env.EMAIL_USER, // Send to yourself
      subject: "OTP Test Connection",
      message: "If you are reading this, your email configuration is working!",
    });
    
    console.log("Test execution finished. Check your email or console.");
  } catch (error) {
    console.error("Test failed:", error.message);
  }
};

testEmail();
