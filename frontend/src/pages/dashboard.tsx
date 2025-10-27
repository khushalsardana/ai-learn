import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI, analyticsAPI } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface User {
  id: string;
  name: string;
  email: string;
  learningStats: {
    totalQuizzesTaken: number;
    averageScore: number;
    totalTimeSpent: number;
    topicsExplored: string[];
  };
}

interface AnalysisData {
  performance_level: string;
  recommendation: string;
  stats: {
    totalQuizzes: number;
    avgScore: number;
    totalTimeSpent: number;
    avgTimePerQuiz: number;
    completionRate: number;
    topicDiversity: number;
    recentImprovement: number;
  };
  topicPerformance: Record<string, { count: number; avgScore: number }>;
  weakTopics: Array<{ topic: string; avgScore: number }>;
  strongTopics: Array<{ topic: string; avgScore: number }>;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!user) return;
    
    setAnalyzing(true);
    try {
      const response = await analyticsAPI.analyze(user.id);
      setAnalysis(response.data);
    } catch (error: any) {
      console.error('Failed to analyze:', error);
      alert(error.response?.data?.message || 'Failed to analyze progress');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem('token');
      console.log('✅ Token removed from localStorage');
      
      // Optional: Call backend logout (not strictly necessary with JWT)
      await authAPI.logout();
      
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if API call fails
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  // Prepare chart data
  const topicChartData = analysis?.topicPerformance 
    ? Object.entries(analysis.topicPerformance).map(([topic, data]) => ({
        topic: topic.charAt(0).toUpperCase() + topic.slice(1),
        score: data.avgScore,
        quizzes: data.count
      }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">🎓 AI-Learn Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Quizzes</div>
            <div className="mt-2 text-3xl font-bold text-indigo-600">
              {user.learningStats.totalQuizzesTaken}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Average Score</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {user.learningStats.averageScore}%
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Time Spent</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {Math.round(user.learningStats.totalTimeSpent / 60)} min
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Topics Explored</div>
            <div className="mt-2 text-3xl font-bold text-purple-600">
              {user.learningStats.topicsExplored.length}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            href="/quiz"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg shadow-lg p-8 hover:from-indigo-600 hover:to-blue-600 transition transform hover:scale-105"
          >
            <h3 className="text-2xl font-bold mb-2">📝 Take a Quiz</h3>
            <p className="text-indigo-100">Start learning with AI-generated questions</p>
          </Link>
          
          <button
            onClick={handleAnalyze}
            disabled={analyzing || user.learningStats.totalQuizzesTaken === 0}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg p-8 hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-left"
          >
            <h3 className="text-2xl font-bold mb-2">
              {analyzing ? '⏳ Analyzing...' : '🤖 Analyze My Progress'}
            </h3>
            <p className="text-purple-100">Get AI-powered insights and recommendations</p>
          </button>
        </div>

        {/* AI Analysis Results */}
        {analysis && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">📊 AI Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Performance Level</h3>
                <p className="text-3xl font-bold text-indigo-600">{analysis.performance_level}</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Recommendation</h3>
                <p className="text-gray-700">{analysis.recommendation}</p>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Avg Score</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.stats.avgScore}%</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Completion Rate</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.stats.completionRate}%</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Topic Diversity</div>
                <div className="text-2xl font-bold text-gray-900">{analysis.stats.topicDiversity}%</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500">Recent Improvement</div>
                <div className={`text-2xl font-bold ${analysis.stats.recentImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.stats.recentImprovement > 0 ? '+' : ''}{analysis.stats.recentImprovement}%
                </div>
              </div>
            </div>

            {/* Topic Performance Chart */}
            {topicChartData.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Topic Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topicChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="topic" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weak and Strong Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {analysis.weakTopics && analysis.weakTopics.length > 0 && (
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">⚠️ Topics to Improve</h3>
                  <ul className="space-y-2">
                    {analysis.weakTopics.map((topic, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <span className="text-gray-700">{topic.topic}</span>
                        <span className="text-red-600 font-semibold">{topic.avgScore}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.strongTopics && analysis.strongTopics.length > 0 && (
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Strong Topics</h3>
                  <ul className="space-y-2">
                    {analysis.strongTopics.map((topic, idx) => (
                      <li key={idx} className="flex justify-between items-center">
                        <span className="text-gray-700">{topic.topic}</span>
                        <span className="text-green-600 font-semibold">{topic.avgScore}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {user.learningStats.totalQuizzesTaken === 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You haven&apos;t taken any quizzes yet. Take your first quiz to start tracking your progress and get AI-powered recommendations!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
