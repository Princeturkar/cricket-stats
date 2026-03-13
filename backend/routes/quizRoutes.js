const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const quizController = require("../controllers/quizController");

const router = express.Router();

router.post("/question", async (req, res) => {
  await quizController.generateQuestion(req, res);
});

router.post("/check-answer", async (req, res) => {
  await quizController.checkAnswer(req, res);
});

router.post("/session", async (req, res) => {
  await quizController.generateQuizSession(req, res);
});

module.exports = router;
