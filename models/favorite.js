const pool = require('../config/db');

class Favorite {

    static async createFavorite(favoriteData) {
        try {
            const checkQuery = `SELECT * FROM user_favorites WHERE user_id = ? AND post_id = ?`;
            const [existing] = await pool.execute(checkQuery, [
                favoriteData.user_id,
                favoriteData.post_id
            ]);

            if (existing.length > 0) {
                return {
                    user_id: favoriteData.user_id,
                    post_id: favoriteData.post_id,
                    message: 'Post already in favorites'
                };
            }

            const query = `INSERT INTO user_favorites (user_id, post_id) VALUES (?, ?)`;
            
            const [result] = await pool.execute(query, [
                favoriteData.user_id,
                favoriteData.post_id
            ]);

            return {
                user_id: favoriteData.user_id,
                post_id: favoriteData.post_id
            };
        } catch (error) {
            console.error('Error adding post to favorites: ', error);
            throw error;
        }
    }

    static async getFavoritesByUserId(userId) {
        try {
            const query = `
                SELECT f.user_id, f.post_id, p.* 
                FROM user_favorites f
                JOIN posts p ON f.post_id = p.id
                WHERE f.user_id = ?
            `;
            
            const [results] = await pool.execute(query, [userId]);
            return results;
        } catch (error) {
            console.error('Error getting user favorites: ', error);
            throw error;
        }
    }

    static async removeFavorite(userId, postId) {
        try {
            const query = `DELETE FROM user_favorites WHERE user_id = ? AND post_id = ?`;
            
            const [result] = await pool.execute(query, [userId, postId]);
            
            return {
                success: result.affectedRows > 0,
                deletedRows: result.affectedRows
            };
        } catch (error) {
            console.error('Error removing post from favorites: ', error);
            throw error;
        }
    }
}

module.exports = Favorite;