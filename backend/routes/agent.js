const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');


// Validate email and mobile format
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile) => /^\+\d{10,15}$/.test(mobile);

// Add new agent
router.post('/', authMiddleware, async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!validateMobile(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format (e.g., +1234567890)' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    let agent = await Agent.findOne({ email });
    if (agent) return res.status(400).json({ message: 'Agent already exists' });

    agent = new Agent({ name, email, mobile, password, createdBy: req.user.id });
    await agent.save();

    res.status(201).json({ message: 'Agent added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all agents
router.get('/', authMiddleware, async (req, res) => {
  try {
    const agents = await Agent.find({ createdBy: req.user.id }).select('-password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete agent by id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid agent ID' });
    }
    const agent = await Agent.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
