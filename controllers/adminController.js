const adminHelpers = require('../helpers/adminHelpers');
const jwt = require('jsonwebtoken');
const maxAge = 3 * 34 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
}

module.exports = {
    adminHome: (req, res) => {
        res.status(200).json({ 'message': 'This is the admin home page' });
    },
    getLogin: (req, res) => {
        res.status(200).json({ 'message': 'This is the admin login page' });
    },
    postLogin: async (req, res, next) => {
        await adminHelpers.doLogin(req.body).then((Login) => {
            if (Login.admin) {
                const user = Login.admin;
                const token = createToken(user._id);
                res.cookie('adminjwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                req.flash('success', 'logged in successfully');
                return res.status(200).json({ success: 'logged in successfully', token });
            } else if (Login.passwordErr) {
                req.flash('error', 'invalid password');
                return res.status(401).json({ passwordErr: 'invalid password' });
            } else if (Login.loginErr) {
                req.flash('error', 'invalid email address');
                return res.status(401).json({ loginErr: 'invalid email address' });
            }
        })
    },
    logout: (req, res) => {
        res.cookie('adminjwt', '', { maxAge: 1 });
        return res.status(200).json({ success: 'logged out successfully' });
    }
}