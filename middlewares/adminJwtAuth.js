const jwt = require('jsonwebtoken');

module.exports = {
    requireAuth: (req, res, next) => {
        const token = req.cookies.adminjwt;
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
                if (err) {
                    res.redirect('/admin-login');
                } else {
                    next();
                }
            });
        } else {
            res.redirect('/admin-login');
        }
    },
    checkAdmin: (req, res, next) => {
        const token = req.cookies.adminjwt;
        if (token) {
            res.redirect('/admin-home');
        }
        else {
            next();
        }
    }

}
