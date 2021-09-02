const applicantHelpers = require('../helpers/applicantHelpers');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 34 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
}

module.exports = {
    home: (req, res) => {
        res.status(200).json({ 'message': 'This is the welcome home' });
    },
    applicantHome: (req, res) => {
        res.status(200).json({ 'message': 'This is the applicant home page' });
    },
    getSignup: (req, res) => {
        res.status(200).json({ 'message': 'This is the applicant signup page' });
    },
    postSignup: async (req, res) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            req.flash('error', 'all fields are required');
            req.flash('username', username);
            req.flash('email', email);
            return res.status(204).json({ error: 'all fields are required' });
        }
        await applicantHelpers.doSignup(req.body).then((response) => {
            req.flash('success', 'account created successfully');
            return res.status(200).json({ success: 'account created successfully' });
        }).catch((err) => {
            req.flash('error', 'email already exist');
            req.flash('username', username);
            req.flash('email', email);
            return res.status(409).json({ error: 'email already exist' });
        });
    },
    getLogin: (req, res) => {
        res.status(200).json({ 'message': 'This is the applicant login page' });
    },
    postLogin: async (req, res, next) => {
        await applicantHelpers.doLogin(req.body).then((Login) => {
            if (Login.applicant) {
                const user = Login.applicant;
                const token = createToken(user._id);
                res.cookie('applicantjwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                req.flash('success', 'logged in successfully');
                return res.status(200).json({ success: 'logged in successfully', token });
            } else if (Login.passwordErr) {
                req.flash('error', 'invalid password');
                return res.status(401).json({ passwordErr: 'invalid password' });
            } else if (Login.blocked) {
                req.flash('error', 'your account suspended');
                return res.status(403).json({ blocked: 'your account suspended' });
            } else if (Login.loginErr) {
                req.flash('error', 'invalid email address');
                return res.status(401).json({ loginErr: 'invalid email address' });
            }
        })
    },
    logout: (req, res) => {
        res.cookie('applicantjwt', '', { maxAge: 1 });
        return res.status(200).json({ success: 'logged out successfully' });
    },
    google: passport.authenticate('google', { scope: ['profile', 'email'] }),
    googleAuth: (req, res, next) => {
        passport.authenticate('google', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/applicant-login'); }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                const token = createToken(user._id);
                res.cookie('applicantjwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                return res.redirect('/applicant-home');
            });
        })(req, res, next);
    },
    facebook: passport.authenticate('facebook', { scope: ['profile', 'email'] }),
    facebookAuth: (req, res, next) => {
        passport.authenticate('google', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/applicant-login'); }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                const token = createToken(user._id);
                res.cookie('applicantjwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                return res.redirect('/applicant-home');
            });
        })(req, res, next);
    },
}