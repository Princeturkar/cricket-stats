const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const chatbotService = require("../services/chatbotService");
const aiService = require("../services/aiService");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const response = await chatbotService.processMessage(message.trim(), req.user._id);
    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      type: "error",
      message: "Error processing your message"
    });
  }
});

router.post("/stream", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    // Get context from database
    const { context } = await chatbotService.getRelevantData(message.toLowerCase(), req.user._id);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const stream = aiService.streamResponse(message.trim(), context);

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Chat stream error:", error);
    res.write(`data: ${JSON.stringify({ type: "error", message: "Error processing message" })}\n\n`);
    res.end();
  }
});

module.exports = router;
