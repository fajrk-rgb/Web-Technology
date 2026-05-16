const express = require('express');

const router = express.Router();

const Order = require('../../models/Order');

router.get('/', async (req, res) => {

    const orders = await Order.find()
        .sort({ createdAt: -1 });

    res.render('admin/orders/index', {

        title: 'Orders',

        orders
    });
});

module.exports = router;