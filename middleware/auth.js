const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        console.log(req.session.user)
        return next(); 
    }
    res.redirect('/login'); 
};

module.exports = isAuthenticated;