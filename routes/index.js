const express = require('express');
const router = express.Router();
const projectRoutes = require('./project')

// Định nghĩa prefix cho từng route
router.use('/project', projectRoutes);

module.exports = router;