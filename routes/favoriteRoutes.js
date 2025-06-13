const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createFavorite, 
    getFavoritesByUser, 
    removeFavorite 
} = require('../controllers/favoriteController');



router.post('/create', createFavorite);

router.get('/user/:userId', getFavoritesByUser);

router.delete('/remove', removeFavorite);

module.exports = router;