const User = require('../models/user');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                success: true,
                data: {
                    _id: user.id,
                    username: user.name_account,
                    email: user.email,
                    dateOfBirth: user.date_of_birth,
                    address: user.address || '',
                    distance: user.search_distance || 1.0
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

const updateUserProfile = async (req, res) => {
    try {
        const { email, username, dateOfBirth, address, search_distance } = req.body;
        console.log(req.body)

        const updateData = {};
        
        if (email) updateData.email = email;
        if (username) updateData.name_account = username;
        if (dateOfBirth) updateData.date_of_birth = dateOfBirth;
        if (address) updateData.address = address;
        if (search_distance) updateData.search_distance = search_distance;

        const result = await User.updateInfo(req.user.id, updateData);

        if (result.updated) {
            res.json({
                success: true,
                data: {
                    _id: result.user.id,
                    username: result.user.name_account,
                    email: result.user.email,
                    dateOfBirth: result.user.date_of_birth,
                    address: result.user.address || '',
                    distance: result.user.search_distance || 1.0
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};