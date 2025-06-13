const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const searchRoutes = require('./searchRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const postRoutes = require('./postRoutes');
const profileRoutes = require('./profileRoutes')

// Định nghĩa prefix cho từng route
router.use('/auth', authRoutes);
router.use('/getData', searchRoutes);
router.use('/favorite', favoriteRoutes);
router.use('/post', postRoutes);
router.use('/profile', profileRoutes)

module.exports = router;