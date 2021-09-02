const jwt = require('jsonwebtoken');
const applicantHelpers = require('../helpers/applicantHelpers');
const objectId = require('mongodb').ObjectID;

module.exports = {
    checkBlocked: (req, res, next) => {
        const token = req.cookies.applicantjwt;
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
                if (err) {
                    res.locals.applicant = null;
                    res.redirect('/login');
                    next();
                } else {
                    const applicant = await applicantHelpers.findApplicant({ _id: objectId(decodedToken.id), $or: [{ status: 'unblocked' }, { status: { $exists: false } }] });
                    if (!applicant) {
                        res.cookie('applicantjwt', '', { maxAge: 1 });
                        res.redirect('/applicant-login');
                    } else {
                        res.locals.applicant = applicant;
                        req.applicant = applicant;
                        next();
                    }
                }
            });
        } else {
            res.locals.applicant = null;
            next();
        }
    },
    requireAuth: (req, res, next) => {
        const token = req.cookies.applicantjwt;
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
                if (err) {
                    res.redirect('/applicant-login');
                } else {
                    next();
                }
            });
        } else {
            res.redirect('/applicant-login');
        }
    },
    checkApplicant: (req, res, next) => {
        const token = req.cookies.applicantjwt;
        if (token) {
            res.redirect('/applicant-home');
        }
        else {
            next();
        }
    }

}
