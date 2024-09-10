
const securityHeaders = (req, res, next) => {

    res.setHeader("Content-Security-Policy", 
        `default-src 'self'; ` + 
        `script-src 'self' 'unsafe-inline'; ` + 
        `style-src 'self' https://fonts.googleapis.com; ` + 
        `img-src 'self' data:; ` + 
        `font-src https://fonts.gstatic.com; ` + 
        `connect-src 'self'; ` + 
        `frame-src 'none'; ` + 
        `object-src 'none'; ` + 
        `base-uri 'self'; ` + 
        `form-action 'self';`
      );

    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "no-referrer");
    return next(); 

};

module.exports = securityHeaders;