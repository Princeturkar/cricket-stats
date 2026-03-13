const aiService = require("../services/aiService");

exports.generateQuestion = async (req, res) => {
  try {
    const { difficulty = "medium", category = "general" } = req.body;

    const question = await aiService.generateQuizQuestion(difficulty, category);

    if (!question) {
      return res.status(500).json({
        message: "Error generating question"
      });
    }

    res.json({
      type: "quiz_question",
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      category: question.category,
      explanation: question.explanation
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({
      message: "Error generating quiz question"
    });
  }
};

exports.checkAnswer = async (req, res) => {
  try {
    const { question, userAnswer, correctAnswer } = req.body;

    if (!question || userAnswer === undefined || correctAnswer === undefined) {
      return res.status(400).json({
        message: "Missing required fields: question, userAnswer, correctAnswer"
      });
    }

    const isCorrect = userAnswer === correctAnswer;
    const feedback = await aiService.generateAnswerFeedback(question, userAnswer, correctAnswer, isCorrect);

    res.json({
      type: "quiz_feedback",
      isCorrect,
      userAnswer,
      correctAnswer,
      feedback: feedback || (isCorrect ? "Great job! 🎉" : "Not quite right, try the next one!")
    });
  } catch (error) {
    console.error("Quiz feedback error:", error);
    res.status(500).json({
      message: "Error checking answer"
    });
  }
};

exports.generateQuizSession = async (req, res) => {
  try {
    const { numQuestions = 5, difficulty = "medium", category = "general" } = req.body;

    if (numQuestions < 1 || numQuestions > 20) {
      return res.status(400).json({
        message: "Number of questions must be between 1 and 20"
      });
    }

    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
      const question = await aiService.generateQuizQuestion(difficulty, category);
      if (question) {
        questions.push({
          id: i + 1,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          difficulty: question.difficulty,
          category: question.category
        });
      }
    }

    res.json({
      type: "quiz_session",
      totalQuestions: questions.length,
      difficulty,
      category,
      questions
    });
  } catch (error) {
    console.error("Quiz session error:", error);
    res.status(500).json({
      message: "Error generating quiz session"
    });
  }
};
