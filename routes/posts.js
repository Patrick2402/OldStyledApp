const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { isAuthed } = require('./login');

const router = express.Router();
const Post = mongoose.model('Post');


router.get('/posts', auth, async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 4; 

    try {
        const posts = await Post.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const totalPosts = await Post.countDocuments(); //number of all posts in Document Posts
        const totalPages = Math.ceil(totalPosts / limit); // number of all pages 

        res.render('posts', {
            title: 'Posts',
            posts: posts,
            isAuthed: isAuthed,
            pagination: {
                totalPosts,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching posts');
    }
});

router.get('/poster', async (req,res, next) => {
    const postId = req.query.post;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('post-detail', {
            title: post.title,
            post: post,
            isAuthed: isAuthed
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).send('Error fetching post');
    }
})


exports.router = router;


