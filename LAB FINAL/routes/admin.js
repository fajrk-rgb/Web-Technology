const express = require('express');

const router = express.Router();

const ordersRouter = require('./admin/orders');

const dashboardController = require('../controllers/admin/dashboardController');




// ADMIN LAYOUT

const { isAdmin } = require('../middleware/auth');

router.use((req, res, next) => {
    res.locals.layout = 'admin/layout';
    next();
});

// Protect all /admin routes with isAdmin
router.use(isAdmin);



// DASHBOARD

router.get('/', dashboardController.getDashboard);


// PRODUCT ROUTES

const productsRouter =
    require('./admin/products');

router.use('/products', productsRouter);

router.use('/orders', ordersRouter);



module.exports = router;