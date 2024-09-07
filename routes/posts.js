const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { isAuthed } = require('./login');

const router = express.Router();
const Post = mongoose.model('Post');

router.get('/posts', auth, (req, res, next) => {
    Post.find()
        .then(posts => {
            res.render('posts', {
                title: 'Posts',
                posts: posts,
                isAuthed: isAuthed
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Error fetching posts');
        });
});


exports.router = router;


