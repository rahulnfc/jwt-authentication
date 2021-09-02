const jwt = require('jsonwebtoken');
const companyHelpers = require('../helpers/companyHelpers');
const objectId = require('mongodb').ObjectID;

module.exports = {
    checkBlocked: (req, res, next) => {
        const token = req.cookies.companyjwt;
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
                if (err) {
                    res.locals.company = null;
                    res.redirect('/login');
                    next();
                } else {
                    const company = await companyHelpers.findCompany({ _id: objectId(decodedToken.id), $or: [{ status: 'unblocked' }, { status: { $exists: false } }] });
                    if (!company) {
                        res.cookie('companyjwt', '', { maxAge: 1 });
                        res.redirect('/company-login');
                    } else {
                        res.locals.company = company;
                        req.company = company;
                        next();
                    }
                }
            });
        } else {
            res.locals.company = null;
            next();
        }
    },
    requireAuth: (req, res, next) => {
        const token = req.cookies.companyjwt;
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
                if (err) {
                    res.redirect('/company-login');
                } else {
                    next();
                }
            });
        } else {
            res.redirect('/company-login');
        }
    },
    checkCompany: (req, res, next) => {
        const token = req.cookies.companyjwt;
        if (token) {
            res.redirect('/company-home');
        }
        else {
            next();
        }
    }

}
