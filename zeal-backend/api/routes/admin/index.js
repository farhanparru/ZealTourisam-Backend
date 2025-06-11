const express = require('express');
const router = express.Router();
const adminController = require('./admin'); // Adjust path as needed
const adminAuth = require('../../../middlewares/AdminAuth'); // Adjust path as needed

// Login an admin
router.post('/login', adminController.login);

router.get('/protected', adminAuth, adminController.protected);

router.post('/adminLogout', adminController.AdminLogout)

module.exports = router;