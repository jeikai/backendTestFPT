const express = require('express');
const router = express.Router();
const { getAll, getDetail } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/getAll', getAll);
router.get('/getDetail', getDetail);

module.exports = router;