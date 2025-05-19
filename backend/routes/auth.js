const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Validate email format
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Middleware to restrict registration
const restrictRegistration = (req, res, next) => {
  const secret = req.header('X-Admin-Secret');
  console.log('Received X-Admin-Secret:', secret);
  console.log('Expected ADMIN_SECRET:', process.env.ADMIN_SECRET);
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Unauthorized: Invalid admin secret' });
  }
  next();
};

// Register admin user (restricted)
router.post('/register', restrictRegistration, async (req, res) => {
  const { email, password } = req.body;
  console.log('Register request:', { email, password: '****' });
  try {
    if (!validateEmail(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      console.log('Password too short:', password.length);
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ email, password, role: 'admin' });
    await user.save();
    console.log('User registered:', email);

    const token = user.generateAuthToken();
    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login admin user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password: '****' });
  try {
    if (!validateEmail(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();
    console.log('Login successful:', email);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;