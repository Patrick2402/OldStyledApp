const express = require('express');
const mongoose = require('mongoose');
const argon = require('argon2');
const validator = require('validator');
const isAuthenticated = require('../middleware/auth');

router = express.Router();
const User = mongoose.model('User');

router.post('/change-password',isAuthenticated,(req, res, next) => {
    console.log('Changing password');
    let new_password = req.body.new_password;

    if (!validator.isLength(new_password, { min: 10 })) {
        return res.render('changePassword', { title: 'Change Password' });
    } 


    User.findById(req.session.user._id)
        .then(async user => {
            console.log(req.session.user._id)
            if (!user) {
                return res.status(404).send('User not found');
            }

                const hash = await argon.hash(new_password);
                    user.password = hash;
                    console.log('redirecting2')
                    user.save()
                        .then(() => {
                            console.log('redirecting3')
                            res.redirect('/profile');
                        })
                        .catch(err => {
                            console.error('Error saving new password:', err);
                            res.status(500).send('Error updating password');
                        });

        })
        .catch(err => {
            console.error('Error finding user:', err);
            res.status(500).send('Error finding user');
        });

});

router.get('/change-password',isAuthenticated, (req, res, next) => {
    console.log('Changing password GET');
    res.render('changePassword', {title: 'Change Password'});
});


exports.router = router;