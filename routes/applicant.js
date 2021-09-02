const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicantController');
const { checkApplicant, checkBlocked, requireAuth } = require('../middlewares/applicantJwtAuth');

// home page
router.get('/', checkApplicant, applicantController.home);
router.get('/applicant-home', requireAuth, checkBlocked, applicantController.applicantHome);

// signup routes
router.get('/applicant-signup', checkApplicant, applicantController.getSignup);
router.post('/applicant-signup', applicantController.postSignup);

// login routes
router.get('/applicant-login', checkApplicant, applicantController.getLogin);
router.post('/applicant-login', applicantController.postLogin);
router.get('/applicant-logout', applicantController.logout);

// google auth
router.get('/google', checkApplicant, applicantController.google);
router.get('/google/auth', applicantController.googleAuth);

// facebook auth 
router.get('/facebook', checkApplicant, applicantController.facebook);
router.get('/facebook/auth', applicantController.facebookAuth);

module.exports = router;