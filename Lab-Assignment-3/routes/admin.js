const express = require('express');

const router = express.Router();

const Product = require('../models/Products');

const Order = require('../models/Order');

const ordersRouter =
    require('./admin/orders');




// ADMIN LAYOUT

const { isAdmin } = require('../middleware/auth');

router.use((req, res, next) => {
    res.locals.layout = 'admin/layout';
    next();
});

// Protect all /admin routes with isAdmin
router.use(isAdmin);



// DASHBOARD

router.get('/', async (req, res) => {

    const productCount =
        await Product.countDocuments();

    const categories =
        await Product.distinct('category');

    const categoryCount =
        categories.length;

    const orderCount =
        await Order.countDocuments();

    res.render('admin/dashboard', {

        title: 'Dashboard',

        productCount,

        categoryCount,

        orderCount
    });
});


// PRODUCT ROUTES

const productsRouter =
    require('./admin/products');

router.use('/products', productsRouter);

router.use('/orders', ordersRouter);



module.exports = router;