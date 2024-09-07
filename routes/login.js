
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const register = require('./register');

let isAuthed = false;

// const users = []

router = express.Router();



router.get('/login', (req, res, next) => {
  res.render('../views/login',{title: 'Login'});
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await register.user.findOne({ username: username });

        if (!user) {
            return res.render('login', { title: 'Login', error: true });
        }
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.render('login', { title: 'Login', error: true });
        }

        req.session.user = user; 
        isAuthed = true;
        res.redirect('/');
        console.log('User Logged');
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});


exports.routes = router;
exports.isAuthed = isAuthed;
