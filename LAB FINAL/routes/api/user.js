const express = require('express');

const userController = require('../../controllers/api/userController');
const { verifyToken } = require('../../middleware/verifyToken');

const router = express.Router();

router.get('/profile', verifyToken, userController.getProfile);

module.exports = router;
