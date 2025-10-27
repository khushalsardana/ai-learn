import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Sample course data - in production, this would come from database
const courses = [
  {
    id: '1',
    title: 'Python Programming',
    topic: 'python',
    description: 'Master Python programming from basics to advanced concepts',
    difficulty: 'medium',
    icon: '🐍',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'JavaScript Fundamentals',
    topic: 'javascript',
    description: 'Learn modern JavaScript and ES6+ features',
    difficulty: 'medium',
    icon: '📜',
    color: 'bg-yellow-500'
  },
  {
    id: '3',
    title: 'Data Structures',
    topic: 'data-structures',
    description: 'Essential data structures and algorithms',
    difficulty: 'hard',
    icon: '🌳',
    color: 'bg-green-500'
  },
  {
    id: '4',
    title: 'React.js',
    topic: 'react',
    description: 'Build modern web applications with React',
    difficulty: 'medium',
    icon: '⚛️',
    color: 'bg-cyan-500'
  },
  {
    id: '5',
    title: 'Node.js & Express',
    topic: 'nodejs',
    description: 'Backend development with Node.js',
    difficulty: 'medium',
    icon: '🟢',
    color: 'bg-emerald-500'
  },
  {
    id: '6',
    title: 'Machine Learning Basics',
    topic: 'machine-learning',
    description: 'Introduction to ML concepts and algorithms',
    difficulty: 'hard',
    icon: '🤖',
    color: 'bg-purple-500'
  },
  {
    id: '7',
    title: 'SQL & Databases',
    topic: 'sql',
    description: 'Database design and SQL queries',
    difficulty: 'easy',
    icon: '🗄️',
    color: 'bg-indigo-500'
  },
  {
    id: '8',
    title: 'Web Development',
    topic: 'web-development',
    description: 'HTML, CSS, and responsive design',
    difficulty: 'easy',
    icon: '🌐',
    color: 'bg-pink-500'
  }
];

// Get all courses
router.get('/', requireAuth, async (req, res) => {
  try {
    res.json({
      courses,
      total: courses.length
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get course by topic
router.get('/:topic', requireAuth, async (req, res) => {
  try {
    const { topic } = req.params;
    const course = courses.find(c => c.topic === topic);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
