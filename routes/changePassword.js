const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middleware/auth');

router = express.Router();
const User = mongoose.model('User');

router.post('/change-password',isAuthenticated, (req, res, next) => {
    console.log('Changing password');
    let new_password = req.body.new_password;
    
    User.findById(req.session.user._id)
        .then(user => {
            console.log(req.session.user._id)
            if (!user) {
                return res.status(404).send('User not found');
            }

                bcrypt.hash(new_password, 10, (err, hashedPassword) => {
                    console.log(new_password)
                    if (err) {
                        return res.status(500).send('Error hashing password');
                    }

                    user.password = hashedPassword;
                    user.save()
                        .then(() => {
                            res.redirect('/profile');
                        })
                        .catch(err => {
                            console.error('Error saving new password:', err);
                            res.status(500).send('Error updating password');
                        });
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