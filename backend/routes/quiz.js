import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { requireAuth } from '../middleware/auth.js';
import Quiz from '../models/Quiz.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

// Generate quiz using Gemini API
router.get('/generate', requireAuth, async (req, res) => {
  try {
    const { topic, difficulty = 'medium', count = 5 } = req.query;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Initialize Gemini AI inside the route handler
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Generate ${count} multiple-choice questions about ${topic} at ${difficulty} difficulty level.

Return ONLY a valid JSON array with no additional text, markdown formatting, or code blocks. The format must be:
[
  {
    "question": "question text here",
    "options": ["option A", "option B", "option C", "option D"],
    "answer": "correct option text (must match one of the options exactly)"
  }
]

Requirements:
- Each question must be clear and educational
- Provide exactly 4 options for each question
- The answer must be the full text of the correct option, not just A/B/C/D
- Make questions relevant to ${topic}
- Ensure ${difficulty} difficulty level
- Return only the JSON array, nothing else`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response
    text = text.trim();
    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate the structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid quiz format from AI');
    }

    // Save quiz to database
    const quiz = new Quiz({
      topic,
      questions,
      difficulty
    });
    await quiz.save();

    res.json({
      quizId: quiz._id,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options
      })) // Don't send answers to frontend
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz',
      message: error.message 
    });
  }
});

// Submit quiz answers
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const { quizId, answers, timeSpent } = req.body;
    const userId = req.userId; // Changed from req.session.userId to req.userId (JWT)

    if (!quizId || !answers || !timeSpent) {
      return res.status(400).json({ 
        error: 'Quiz ID, answers, and time spent are required' 
      });
    }

    // Get the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let correctAnswers = 0;
    const detailedAnswers = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.answer;
      if (isCorrect) correctAnswers++;

      return {
        questionIndex: index,
        userAnswer,
        correctAnswer: question.answer,
        isCorrect
      };
    });

    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Save progress
    const progress = new Progress({
      userId,
      quizId,
      quizTopic: quiz.topic,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      answers: detailedAnswers
    });
    await progress.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      const stats = user.learningStats;
      const totalQuizzes = stats.totalQuizzesTaken + 1;
      const newAverage = Math.round(
        ((stats.averageScore * stats.totalQuizzesTaken) + score) / totalQuizzes
      );

      user.learningStats.totalQuizzesTaken = totalQuizzes;
      user.learningStats.averageScore = newAverage;
      user.learningStats.totalTimeSpent += timeSpent;
      
      if (!stats.topicsExplored.includes(quiz.topic)) {
        user.learningStats.topicsExplored.push(quiz.topic);
      }

      await user.save();
    }

    res.json({
      message: 'Quiz submitted successfully',
      result: {
        score,
        correctAnswers,
        totalQuestions,
        timeSpent,
        percentage: score,
        answers: detailedAnswers
      }
    });

  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get quiz history for a user
router.get('/history/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (userId !== req.userId.toString() && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const history = await Progress.find({ userId })
      .sort({ completedAt: -1 })
      .limit(50)
      .select('-answers'); // Exclude detailed answers for performance

    res.json({
      history,
      total: history.length
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

// Get quiz details (for review)
router.get('/details/:quizId', requireAuth, async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId; // Changed from req.session.userId to req.userId (JWT)

    const progress = await Progress.findOne({ 
      _id: quizId, 
      userId 
    }).populate('quizId');

    if (!progress) {
      return res.status(404).json({ error: 'Quiz attempt not found' });
    }

    res.json({ progress });

  } catch (error) {
    console.error('Get quiz details error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz details' });
  }
});

export default router;
