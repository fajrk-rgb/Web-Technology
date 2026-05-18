const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.get('/login', authController.showLogin);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/profile', isLoggedIn, authController.profile);

module.exports = router;
