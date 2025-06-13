const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.error('No token provided in the request headers.');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
        code: 'NO_TOKEN'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Fun Play');
      console.log('Token decoded successfully:', decoded);

      const user = await User.findById(decoded.id);

      if (!user) {
        console.error('User not found for the provided token.');
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
          code: 'USER_NOT_FOUND'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
        code: 'TOKEN_EXPIRED'
      });
    }
  } catch (error) {
    console.error('Server error in auth middleware:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, server error',
      code: 'SERVER_ERROR'
    });
  }
};

module.exports = { protect };