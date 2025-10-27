import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
            🎓 AI-Learn
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your Personalized E-Learning Platform Powered by AI
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Take AI-generated quizzes, track your progress, and get intelligent recommendations 
            tailored to your learning journey.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border-2 border-indigo-600"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Quizzes</h3>
            <p className="text-gray-600">
              Dynamic quiz generation using Google&apos;s Gemini AI. Get unique questions every time you practice.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Analytics</h3>
            <p className="text-gray-600">
              Track your progress with detailed analytics and visualizations of your learning journey.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Recommendations</h3>
            <p className="text-gray-600">
              Machine learning analyzes your performance to recommend the best learning path for you.
            </p>
          </div>
        </div>

        {/* Topics */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Learn From Multiple Topics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Python 🐍', 'JavaScript 📜', 'React ⚛️', 'Node.js 🟢', 'SQL 🗄️', 'Data Structures 🌳', 'ML 🤖', 'Web Dev 🌐'].map((topic) => (
              <div 
                key={topic}
                className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow"
              >
                <span className="text-lg font-semibold text-gray-700">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of learners improving their skills with AI-powered education
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500">
          <p>Built with Next.js, Express, MongoDB, and Google Gemini AI</p>
          <p className="mt-2">© 2025 AI-Learn. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
