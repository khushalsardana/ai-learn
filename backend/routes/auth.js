import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.SESSION_SECRET || 'your-secret-key',
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      passwordHash: password
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    console.log('✅ Registration - Created token for user:', user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token, // Return token instead of setting cookie
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    user.learningStats.lastActive = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    console.log('✅ Login - Created token for user:', user._id);

    res.json({
      message: 'Login successful',
      token, // Return token
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        learningStats: user.learningStats
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // With JWT, logout is handled on frontend by removing token
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Changed from req.session.userId to req.userId
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        learningStats: user.learningStats
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
