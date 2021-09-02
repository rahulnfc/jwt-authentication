const companyHelpers = require('../helpers/companyHelpers');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const maxAge = 3 * 34 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
}

module.exports = {
    companyHome: (req, res) => {
        res.status(200).json({ 'message': 'This is the company home page' });
    },
    getSignup: (req, res) => {
        res.status(200).json({ 'message': 'This is the company signup page' });
    },
    postSignup: async (req, res) => {
        const { companyname, email, password } = req.body;
        if (!companyname || !email || !password) {
            req.flash('error', 'all fields are required');
            req.flash('companyname', companyname);
            req.flash('email', email);
            return res.status(400).json({ error: 'all fields are required' });
        }
        await companyHelpers.doSignup(req.body).then((response) => {
            req.flash('success', 'account created successfully');
            return res.status(200).json({ success: 'account created successfully' });
        }).catch((err) => {
            req.flash('error', 'email already exist');
            req.flash('companyname', companyname);
            req.flash('email', email);
            return res.status(409).json({ error: 'email already exist' });
        });
    },
    getLogin: (req, res) => {
        res.status(200).json({ 'message': 'This is the company login page' });
    },
    postLogin: async (req, res, next) => {
        await companyHelpers.doLogin(req.body).then((Login) => {
            if (Login.company) {
                const user = Login.company;
                const token = createToken(user._id);
                res.cookie('companyjwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
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
        res.cookie('companyjwt', '', { maxAge: 1 });
        return res.status(200).json({ success: 'logged out successfully' });
    },
    jobPostPage: (req, res) => {
        res.status(200).json({ 'message': 'This is the add job page' });
    },
    postJob: (req, res) => {
        req.body.PostDate = moment(Date.now()).format('MM Do YYYY');
        req.body.LastDate = moment(req.body.LastDate).format("MM Do YYYY");
        companyHelpers.createJob(req.body).then((response) => {
            return res.status(200).json({ success: 'job posted successfully', response });
        });
    }
}