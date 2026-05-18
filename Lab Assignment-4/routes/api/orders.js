const express = require('express');
const ordersController = require('../../controllers/api/ordersController');
const { verifyToken } = require('../../middleware/verifyToken');

const router = express.Router();

router.post('/', verifyToken, ordersController.createOrder);

module.exports = router;
