const jwt = require('jsonwebtoken');
const User = require('../models/user');
const validator = require('../utils/validator');
const Token = require('../models/token');

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const register = async (req, res) => {
    try {
        const { email, name_account, password, date_of_birth, address } = req.body;
        console.log(req.body)
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Email already exists');
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        if (!validator.verifyEmail(email)) {
            console.log('Invalid email');
            return res.status(400).json({
                success: false,
                message: 'Invalid email'
            });
        }

        if (!validator.verifyPassword(password)) {
            console.log('Invalid password');
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Chuyển đổi định dạng date_of_birth từ dd/mm/yyyy sang yyyy-mm-dd
        let formattedDOB;
        if (date_of_birth && date_of_birth.includes('/')) {
            const [day, month, year] = date_of_birth.split('/');
            formattedDOB = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
            console.log('Invalid date format');
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Please use DD/MM/YYYY'
            });
        }

        const user = await User.create({
            email,
            name_account,
            password,
            date_of_birth: formattedDOB,
            address
        });

        console.log(user);

        if (user) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            // Store refresh token in database
            await Token.create({
                userId: user._id,
                refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.name_account,
                    email: user.email,
                    dateOfBirth: user.date_of_birth,
                    address: user.address,
                    search_distance: user.search_distance || 10, // Default value if not set
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            });
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await User.comparePassword(user, password))) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            await Token.create({
                userId: user.id,
                refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            res.json({
                success: true,
                data: {
                    _id: user.id,
                    username: user.name_account,
                    email: user.email,
                    distance: user.search_distance,
                    dob: user.date_of_birth,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                success: true,
                data: {
                    _id: user.id,
                    username: user.name_account,
                    email: user.email
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Log out account
const deleteRefreshToken = async (req, res) => {
    try {
        const userId = req.user.id;
        await Token.deleteMany({ userId });

        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message
        });
    }
};

// Refresh token and recreate
const refreshToken = async (req, res) => {
    try {
        const { userId, oldRefreshToken } = req.body;

        // Verify old refresh token
        const decoded = jwt.verify(oldRefreshToken, process.env.JWT_SECRET);

        // Delete old refresh token
        await Token.deleteOne({ userId: userId, refreshToken: oldRefreshToken });

        // Generate new tokens
        const accessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id);

        // Save new refresh token
        await Token.create({
            userId: decoded.id,
            refreshToken: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        res.status(200).json({
            success: true,
            refreshToken: newRefreshToken,
            accessToken: accessToken
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    deleteRefreshToken,
    refreshToken
};