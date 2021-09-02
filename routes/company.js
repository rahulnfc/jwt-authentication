const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { checkCompany, checkBlocked, requireAuth } = require('../middlewares/companyJwtAuth');

// home page
router.get('/company-home', requireAuth, checkBlocked, companyController.companyHome);

// signup routes
router.get('/company-signup', checkCompany, companyController.getSignup);
router.post('/company-signup', companyController.postSignup);

// login routes
router.get('/company-login', checkCompany, companyController.getLogin);
router.post('/company-login', companyController.postLogin);
router.get('/company-logout', companyController.logout);

// job routes
router.get('/add-job', requireAuth, checkBlocked, companyController.jobPostPage);
router.post('/add-job', companyController.postJob);

module.exports = router;