const nodemailer = require("nodemailer");
const axios = require("axios");

const sendEmail = async (options) => {
  // 1. If Resend API key is present, use HTTP API (bypasses SMTP blocking)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await axios.post(
        "https://api.resend.com/emails",
        {
          from: "Cricket Arena <onboarding@resend.dev>",
          to: options.email,
          subject: options.subject,
          html: options.html || `<p>${options.message}</p>`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Email sent via Resend:", response.data);
      return { success: true, messageId: response.data.id };
    } catch (error) {
      console.error("Resend API error:", error.response?.data || error.message);
      throw new Error("Email could not be sent via Resend");
    }
  }

  // 2. Fallback: Check if email credentials are provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === "your-email@gmail.com") {
    console.log("---------------------------------------");
    console.log("SIMULATED EMAIL (No credentials found):");
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log("---------------------------------------");
    return { success: true, simulated: true };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 5000, // 5 seconds connection timeout
    greetingTimeout: 5000,   // 5 seconds greeting timeout
    socketTimeout: 5000,     // 5 seconds socket inactivity timeout
  });

  const mailOptions = {
    from: `"Cricket Stats" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
