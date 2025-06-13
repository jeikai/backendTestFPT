const Post = require('../models/post');

const getAll = async (req, res) => {
    try {
        let { limit, page } = req.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;

        const result = await Post.getAllPost(limit, page);
        if (result) {
            res.json({
                success: true,
                ...result
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No posts found'
            });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDetail = async (req, res) => {
    try {
        let { postId } = req.query;

        const result = await Post.getDetailByPostId(postId);
        if (result) {
            res.json({
                success: true,
                ...result
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No posts found'
            });
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    getAll,
    getDetail
} 