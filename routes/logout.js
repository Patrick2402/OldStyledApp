const express = require('express');

const router = express.Router();

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');  
        console.log('Logged out');
    });
});

module.exports = router;
