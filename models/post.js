const pool = require('../config/db');

class Post {
    static async searchByWord(search) {
        try {
            if (!search) {
                return [];
            }

            const searchTerm = search.trim();

            const postQuery = 'SELECT * FROM posts WHERE message REGEXP ?';
            const [posts] = await pool.execute(postQuery, [`[[:<:]]${searchTerm}[[:>:]]`]);

            const commentQuery = 'SELECT * FROM comments WHERE message REGEXP ?';
            const [comments] = await pool.execute(commentQuery, [`[[:<:]]${searchTerm}[[:>:]]`]);

            const subCommentQuery = 'SELECT * FROM sub_comments WHERE message REGEXP ?';
            const [subComments] = await pool.execute(subCommentQuery, [`[[:<:]]${searchTerm}[[:>:]]`]);

            return {
                posts,
                comments,
                subComments,
                totalResults: posts.length + comments.length + subComments.length
            };
        } catch (error) {
            console.error('Error finding result match search word: ', error);
            throw error;
        }
    }
    static async getDetailByPostId(post_id) {
        try {
            if (!post_id) {
                return [];
            }

            const getPostQuery = "SELECT * FROM posts WHERE id = ?";
            const [posts] = await pool.execute(getPostQuery, [post_id]);

            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];

                // Get images
                const imagesQuery = 'SELECT * FROM post_images WHERE post_id = ?';
                const [images] = await pool.execute(imagesQuery, [post.id]);
                post.images = images;

                // Get sub images
                const subImagesQuery = 'SELECT * FROM sub_post_images WHERE post_id = ?';
                const [sub_images] = await pool.execute(subImagesQuery, [post.id]);
                post.sub_images = sub_images;

                // Get comments
                const commentsQuery = 'SELECT * FROM comments WHERE post_id = ?';
                const [comments] = await pool.execute(commentsQuery, [post.id]);
                post.comments = comments;

                // For each comment, get sub-comments
                for (let j = 0; j < comments.length; j++) {
                    const comment = comments[j];
                    const subCommentsQuery = 'SELECT * FROM sub_comments WHERE parent_comment_id = ?';
                    const [sub_comments] = await pool.execute(subCommentsQuery, [comment.id]);
                    comment.sub_comments = sub_comments;
                }
            }

            return posts;
        } catch (error) {
            console.error('Error getting data: ', error);
            throw error;
        }
    }
    static async getAllPost(limit = 10, page = 1) {
        try {

            const offset = (page - 1) * limit;

            const getPostQuery = `SELECT * FROM posts LIMIT ? OFFSET ?`;
            const [posts] = await pool.execute(getPostQuery, [limit, offset]);

            if (posts.length === 0) return [];

            await Promise.all(posts.map(async (post) => {
                const [images, sub_images, comments] = await Promise.all([
                    pool.execute('SELECT * FROM post_images WHERE post_id = ?', [post.id]),
                    pool.execute('SELECT * FROM sub_post_images WHERE post_id = ?', [post.id]),
                    pool.execute('SELECT * FROM comments WHERE post_id = ?', [post.id])
                ]);

                post.images = images[0];
                post.sub_images = sub_images[0];
                post.comments = comments[0];

                await Promise.all(post.comments.map(async (comment) => {
                    const [sub_comments] = await pool.execute(
                        'SELECT * FROM sub_comments WHERE parent_comment_id = ?',
                        [comment.id]
                    );
                    comment.sub_comments = sub_comments;
                }));
            }));

            const [[{ total }]] = await pool.execute("SELECT COUNT(*) as total FROM posts");
            const totalPages = Math.ceil(total / limit);

            return { posts, total, totalPages, currentPage: page };
        } catch (error) {
            console.error('Error getting data: ', error);
            throw error;
        }
    }
}

module.exports = Post;