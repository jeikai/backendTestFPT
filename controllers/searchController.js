const Post = require('../models/post');

const search = async (req, res) => {
    try {
        const searchTerm = req.query.search || (req.body && req.body.search);
        console.log("Search request params:", req.query);
        console.log("Search request body:", req.body);
        console.log("Search word:", searchTerm);
        
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term is required'
            });
        }
        
        // Split the search term by commas and trim each part
        const searchTerms = searchTerm.split(',').map(term => term.trim()).filter(term => term.length > 0);
        console.log("Search terms after splitting:", searchTerms);
        
        // Array to store combined results
        const combinedResults = {
            posts: [],
            comments: [],
            subComments: [],
            totalResults: 0
        };
        
        // Process each search term
        for (const term of searchTerms) {
            const result = await Post.searchByWord(term);
            
            if (result && result.totalResults > 0) {
                // Add unique posts, comments, and subComments to the combined results
                combinedResults.posts = [...combinedResults.posts, ...result.posts.filter(
                    post => !combinedResults.posts.some(p => p.id === post.id)
                )];
                
                combinedResults.comments = [...combinedResults.comments, ...result.comments.filter(
                    comment => !combinedResults.comments.some(c => c.id === comment.id)
                )];
                
                combinedResults.subComments = [...combinedResults.subComments, ...result.subComments.filter(
                    subComment => !combinedResults.subComments.some(sc => sc.id === subComment.id)
                )];
            }
        }
        
        // Update the total results count
        combinedResults.totalResults = 
            combinedResults.posts.length + 
            combinedResults.comments.length + 
            combinedResults.subComments.length;
        
        if (combinedResults.totalResults > 0) {
            res.json({
                success: true,
                result: combinedResults
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Cannot find any results for these search terms'
            });
        }

    } catch (error) {
        console.log("Error when search:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    search,
}