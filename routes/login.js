
const express = require('express');
const mongoose = require('mongoose');
const argon = require('argon2');
const validator = require('validator');
const register = require('./register');

let isAuthed = false;

router = express.Router();



router.get('/login', (req, res, next) => {
  res.render('../views/login',{title: 'Login', error: false, message: ''});
});

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!validator.isAlphanumeric(username)) {
        return res.render('login', { title: 'Login', error: true, message: 'Invalid username format, Only letters and numbers allowed!' });
    }

    try {
        const user = await register.user.findOne({ username: username });

        if (!user) {
            return res.render('login', { title: 'Login', error: true, message: "Invalid username" });
        }
        const match = await argon.verify(user.password, password)

        if (!match) {
            return res.render('login', { title: 'Login', error: true, message: 'Invalid password' });
        }

        req.session.user = user; 
        isAuthed = true;
        res.redirect('/');
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Error logging in');
    }
});


exports.routes = router;
exports.isAuthed = isAuthed;
