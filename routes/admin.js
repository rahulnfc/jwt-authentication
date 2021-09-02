const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { checkAdmin, requireAuth } = require('../middlewares/adminJwtAuth');

router.get('/admin-home', requireAuth, adminController.adminHome);
router.get('/admin-login', checkAdmin, adminController.getLogin);
router.post('/admin-login', adminController.postLogin);
router.get('/admin-logout', adminController.logout);


module.exports = router;