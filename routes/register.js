const express = require('express');
const argon = require('argon2');
const mongoose = require('mongoose');

const router = express.Router();

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

router.get('/register', (req, res, next) => {
    res.render('register', { title: 'Register', error: false });
});

router.post('/register', async (req, res, next) => {
    const { username, password, re_password } = req.body;

    if (password !== re_password) {
        return res.render('register', { title: 'Register', error: true });
    }

    try {
        const hashedPassword = await argon.hash(password);
        const newUser = new User({
            username: username,
            password: hashedPassword
        });

        await newUser.save(); 
        console.log('User saved successfully:', newUser);
        res.redirect('/login');
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Error registering user');
    }
});

exports.router = router;
exports.user = User;
