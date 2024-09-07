const express = require('express');
const mongoose = require('mongoose');
const isAuthenticated = require('../middleware/auth');
const { isAuthed } = require('./login');


const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date },
    username: {type: String, required: true}
});

const Post = mongoose.model('Post', postSchema);


// main code 

router = express.Router();


router.get('/addPost',isAuthenticated, (req, res, next) => {
    const isAuthed = req.session.user ? true : false;
    res.render('../views/addPost',{title: 'Add Post', isAuthed: isAuthed})
});

router.post('/AddPost',(req, res, next) => {
    const date = new Date();
    console.log('Iam creating post requrest')

    newPost = new Post({
        title: req.body.title, 
        content: req.body.content,
        username: req.session.user.username,
        date: date
    })

    newPost.save()
        .then(result => {
            console.log('Post saved:', result);
            res.redirect('/posts'); // redirect to posts site
        })
        .catch(err => {
            console.error('Error saving post:', err);
            res.status(500).send('Error saving post');
        });


    // posts.push({title: req.body.title, content: req.body.content, date: date});


});

exports.router = router;


