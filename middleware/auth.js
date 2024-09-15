// middleware to check that user is authenticated , if yes ok :) if not redirect to the login page. 

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); 
    }
    res.redirect('/login'); 
};

module.exports = isAuthenticated;