const pool = require('../config/db');

class Comment {
    static async getCommentsByPostId(post_id) {
        try {
            if (!post_id) {
                return [];
            }

            

            const commentQuery = 'SELECT * FROM comments WHERE post_id = ?';
            const [comments] = await pool.execute(commentQuery, [post_id]);

            for (let i = 0; i < comments.length; i++) {
                const subCommentQuery = 'SELECT * FROM sub_comments WHERE parrent_comment_id = ?';
                const [subComments] = await pool.execute(subCommentQuery, [comments[i].id]);

                comments[i].sub_comments = subComments;
            }
            
            return comments;
            
        } catch (error) {
            console.error("Error in get comments: ", error);
            throw error;
        }
    }
}

module.exports = Comment;