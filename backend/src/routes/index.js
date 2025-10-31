const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const feedbackRoutes = require('./feedback.routes');

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/feedback', feedbackRoutes);

module.exports = router;
