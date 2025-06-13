const pool = require('../config/db');

class Token {
  static async create(tokenData) {
    try {
      
      const query = `
        INSERT INTO refresh_tokens (user_id, refresh_token, expires_at)
        VALUES (?, ?, ?)
      `;
      
      await pool.execute(query, [
        tokenData.userId,
        tokenData.refreshToken,
        tokenData.expiresAt
      ]);
      
      return true;
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }
  
  static async deleteMany(condition) {
    try {
      
      
      const query = 'DELETE FROM refresh_tokens WHERE user_id = ?';
      await pool.execute(query, [condition.userId]);
      
      return true;
    } catch (error) {
      console.error('Error deleting tokens:', error);
      throw error;
    }
  }
  
  static async deleteOne(condition) {
    try {
      
      
      const query = 'DELETE FROM refresh_tokens WHERE user_id = ? AND refresh_token = ? LIMIT 1';
      await pool.execute(query, [condition.userId, condition.refreshToken]);
      
      return true;
    } catch (error) {
      console.error('Error deleting token:', error);
      throw error;
    }
  }
  
  static async findOne(condition) {
    try {
      
      
      const query = 'SELECT * FROM refresh_tokens WHERE user_id = ? AND refresh_token = ? LIMIT 1';
      const [rows] = await pool.execute(query, [condition.userId, condition.refreshToken]);
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding token:', error);
      throw error;
    }
  }
}

module.exports = Token;