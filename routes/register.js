const express = require('express');
const argon = require('argon2');
const mongoose = require('mongoose');
const validator = require('validator');

const router = express.Router();

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

router.get('/register', (req, res, next) => {
    res.render('register', { title: 'Register', error: false });
});

router.post('/register', async (req, res, next) => {
    const { username, password, re_password } = req.body;
    
   

    

    try {
        const existingUser = await User.findOne({ username: username }); //checking if user exists
        if (existingUser) {
            return res.render('register', { title: 'Register', error: true, message: "Username is taken!" });
        }
        
        if (!validator.isAlphanumeric(username)) {
            return res.render('register', { title: 'Register',error: true,  message:"Invalid username format, Only letters and numbers allowed!" });
    
        }

        if (!validator.isLength(password, { min: 10 })) {
            return res.render('register', { title: 'Register',error: true,  message:"Password shoud has minimum 10 characters length!" });
        } 

        if (password !== re_password) {
            return res.render('register', { title: 'Register', error: true, message:"Passwords are not the same!" });
        }

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
