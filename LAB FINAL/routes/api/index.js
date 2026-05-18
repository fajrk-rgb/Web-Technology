const express = require('express');

const router = express.Router();

const productsRouter = require('./products');
const authRouter = require('./auth');
const ordersRouter = require('./orders');
const userRouter = require('./user');

router.use('/products', productsRouter);
router.use('/auth', authRouter);
router.use('/orders', ordersRouter);
router.use('/user', userRouter);

module.exports = router;
