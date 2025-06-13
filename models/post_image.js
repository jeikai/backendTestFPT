const pool = require('../config/db');

class Post_Image {
    static async getImagesByPostId(post_id) {
        try {
            if (!post_id) {
                return [];
            }

            

            const imagesQuery = 'SELECT * FROM post_images WHERE post_id = ?';
            const [images] = await pool.execute(imagesQuery, [post_id]);

            for (let i = 0; i < images.length; i++) {
                const subPostImagesQuery = 'SELECT * FROM sub_post_images WHERE post_id = ?';
                const [subPostImages] = await pool.execute(subPostImagesQuery, [images[i].post_id]);

                images[i].sub_post_images = subPostImages;
            }
            
            return images;
            
        } catch (error) {
            console.error("Error in get images: ", error);
            throw error;
        }
    }
}

module.exports = Post_Image;