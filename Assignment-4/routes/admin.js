const express = require('express');

const router = express.Router();

const Product = require('../models/Products');



// ADMIN LAYOUT

router.use((req, res, next) => {

    res.locals.layout = 'admin/layout';

    next();
});



// DASHBOARD

router.get('/', async (req, res) => {

    const productCount =
        await Product.countDocuments();

    const categories =
        await Product.distinct('category');

    const categoryCount =
        categories.length;

    res.render('admin/dashboard', {

        title: 'Dashboard',

        productCount,

        categoryCount
    });
});



// PRODUCT ROUTES

const productsRouter =
    require('./admin/products');

router.use('/products', productsRouter);



module.exports = router;