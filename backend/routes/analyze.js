import express from 'express';
import axios from 'axios';
import { requireAuth } from '../middleware/auth.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

const router = express.Router();

// Analyze user progress using ML service
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (userId !== req.userId.toString() && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get recent progress data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentProgress = await Progress.find({
      userId,
      completedAt: { $gte: thirtyDaysAgo }
    }).sort({ completedAt: -1 });

    if (recentProgress.length === 0) {
      return res.json({
        message: 'Not enough data for analysis',
        recommendation: 'Take more quizzes to get personalized recommendations!',
        performance_level: 'Beginner',
        stats: {
          totalQuizzes: 0,
          avgScore: 0,
          totalTimeSpent: 0,
          completionRate: 0
        }
      });
    }

    // Calculate statistics
    const totalQuizzes = recentProgress.length;
    const avgScore = Math.round(
      recentProgress.reduce((sum, p) => sum + p.score, 0) / totalQuizzes
    );
    const totalTimeSpent = recentProgress.reduce((sum, p) => sum + p.timeSpent, 0);
    const avgTimePerQuiz = Math.round(totalTimeSpent / totalQuizzes);

    // Calculate completion rate (quizzes finished vs started)
    const completionRate = 1.0; // Simplified - all submitted quizzes are completed

    // Calculate topic diversity
    const uniqueTopics = [...new Set(recentProgress.map(p => p.quizTopic))];
    const topicDiversity = uniqueTopics.length / 8; // Assuming 8 total topics

    // Calculate recent improvement (compare first half vs second half)
    const midPoint = Math.floor(totalQuizzes / 2);
    const firstHalfAvg = recentProgress
      .slice(midPoint)
      .reduce((sum, p) => sum + p.score, 0) / midPoint || 0;
    const secondHalfAvg = recentProgress
      .slice(0, midPoint)
      .reduce((sum, p) => sum + p.score, 0) / midPoint || 0;
    const recentImprovement = secondHalfAvg - firstHalfAvg;

    // Prepare data for ML service
    const mlData = {
      avg_score: avgScore,
      time_spent: avgTimePerQuiz,
      completion_rate: completionRate,
      topic_diversity: topicDiversity,
      recent_improvement: recentImprovement
    };

    // Call ML service
    let mlResponse;
    try {
      const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';
      mlResponse = await axios.post(`${mlServiceUrl}/analyze`, mlData, {
        timeout: 10000 // 10 second timeout
      });
    } catch (mlError) {
      console.error('ML service error:', mlError.message);
      // Fallback to rule-based analysis if ML service is down
      mlResponse = {
        data: ruleBasedAnalysis(mlData)
      };
    }

    // Get topic-wise performance
    const topicPerformance = {};
    recentProgress.forEach(p => {
      if (!topicPerformance[p.quizTopic]) {
        topicPerformance[p.quizTopic] = {
          count: 0,
          totalScore: 0,
          avgScore: 0
        };
      }
      topicPerformance[p.quizTopic].count++;
      topicPerformance[p.quizTopic].totalScore += p.score;
    });

    Object.keys(topicPerformance).forEach(topic => {
      const perf = topicPerformance[topic];
      perf.avgScore = Math.round(perf.totalScore / perf.count);
    });

    res.json({
      performance_level: mlResponse.data.performance_level,
      recommendation: mlResponse.data.recommendation,
      stats: {
        totalQuizzes,
        avgScore,
        totalTimeSpent,
        avgTimePerQuiz,
        completionRate: Math.round(completionRate * 100),
        topicDiversity: Math.round(topicDiversity * 100),
        recentImprovement: Math.round(recentImprovement)
      },
      topicPerformance,
      weakTopics: Object.entries(topicPerformance)
        .filter(([_, perf]) => perf.avgScore < 70)
        .map(([topic, perf]) => ({ topic, avgScore: perf.avgScore }))
        .sort((a, b) => a.avgScore - b.avgScore)
        .slice(0, 3),
      strongTopics: Object.entries(topicPerformance)
        .filter(([_, perf]) => perf.avgScore >= 80)
        .map(([topic, perf]) => ({ topic, avgScore: perf.avgScore }))
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 3)
    });

  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Failed to analyze progress' });
  }
});

// Fallback rule-based analysis
function ruleBasedAnalysis(data) {
  let performanceLevel = 'Beginner';
  let recommendation = 'Keep practicing to improve your skills!';

  const { avg_score, topic_diversity, recent_improvement } = data;

  if (avg_score >= 80 && topic_diversity >= 0.5) {
    performanceLevel = 'Advanced';
    recommendation = 'Excellent work! Consider exploring advanced topics or helping others learn.';
  } else if (avg_score >= 60 && topic_diversity >= 0.3) {
    performanceLevel = 'Intermediate';
    if (recent_improvement > 10) {
      recommendation = 'Great progress! Keep up the momentum and explore more advanced concepts.';
    } else {
      recommendation = 'You\'re doing well. Focus on consistency and try challenging topics.';
    }
  } else {
    if (topic_diversity < 0.3) {
      recommendation = 'Try exploring more diverse topics to broaden your knowledge.';
    } else if (avg_score < 50) {
      recommendation = 'Focus on fundamentals and practice regularly. Consider reviewing weak areas.';
    }
  }

  return {
    performance_level: performanceLevel,
    recommendation
  };
}

export default router;
