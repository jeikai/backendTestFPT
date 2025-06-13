const Favorite = require('../models/favorite');

const createFavorite = async (req, res) => {
    try {
        const { user_id, post_id } = req.body;

        if (!user_id || !post_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: user_id and post_id'
            });
        }

        const result = await Favorite.createFavorite({ user_id, post_id });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Create favorite error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getFavoritesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const favorites = await Favorite.getFavoritesByUserId(userId);
        
        res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { user_id, post_id } = req.body;
        
        if (!user_id || !post_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: user_id and post_id'
            });
        }

        const result = await Favorite.removeFavorite(user_id, post_id);
        
        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: 'Favorite not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Post removed from favorites successfully'
        });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createFavorite,
    getFavoritesByUser,
    removeFavorite
};