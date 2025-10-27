import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { quizAPI, authAPI } from '@/lib/api';

interface Question {
  question: string;
  options: string[];
}

interface QuizData {
  quizId: string;
  topic: string;
  difficulty: string;
  questions: Question[];
}

interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  answers: Array<{
    questionIndex: number;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

export default function TakeQuiz() {
  const router = useRouter();
  const { topic } = router.query;
  
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (topic) {
      checkAuthAndFetchQuiz();
    }
  }, [topic]);

  const checkAuthAndFetchQuiz = async () => {
    try {
      await authAPI.getMe();
      await fetchQuiz();
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.generate(topic as string);
      setQuiz(response.data);
      setSelectedAnswers(new Array(response.data.questions.length).fill(''));
    } catch (error: any) {
      console.error('Failed to fetch quiz:', error);
      alert(error.response?.data?.message || 'Failed to generate quiz. Please try again.');
      router.push('/quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const unanswered = selectedAnswers.filter(a => !a).length;
    if (unanswered > 0) {
      if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds

    try {
      const response = await quizAPI.submit({
        quizId: quiz.quizId,
        answers: selectedAnswers,
        timeSpent
      });
      setResult(response.data.result);
    } catch (error: any) {
      console.error('Failed to submit quiz:', error);
      alert(error.response?.data?.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Generating AI-powered quiz...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-6">
              {result.percentage >= 80 ? '🎉' : result.percentage >= 60 ? '👍' : '📚'} Quiz Complete!
            </h1>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-indigo-600 mb-2">
                {result.percentage}%
              </div>
              <p className="text-xl text-gray-700">
                {result.correctAnswers} out of {result.totalQuestions} correct
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Review Your Answers</h2>
              <div className="space-y-4">
                {result.answers.map((answer, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      answer.isCorrect 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                        answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {answer.isCorrect ? '✓' : '✗'}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">Question {idx + 1}</p>
                        {!answer.isCorrect && (
                          <div className="text-sm">
                            <p className="text-red-700">Your answer: <span className="font-semibold">{answer.userAnswer || 'Not answered'}</span></p>
                            <p className="text-green-700">Correct answer: <span className="font-semibold">{answer.correctAnswer}</span></p>
                          </div>
                        )}
                        {answer.isCorrect && (
                          <p className="text-sm text-green-700">
                            Correct answer: <span className="font-semibold">{answer.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/quiz"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Take Another Quiz
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{topic} Quiz</h1>
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === option
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === option
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === option && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            ← Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz →'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Next →
            </button>
          )}
        </div>

        {/* Answer Status */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {quiz.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-10 h-10 rounded-lg font-semibold transition ${
                idx === currentQuestion
                  ? 'bg-indigo-600 text-white'
                  : selectedAnswers[idx]
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
