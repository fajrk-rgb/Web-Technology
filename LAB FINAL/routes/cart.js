const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

// ADD TO CART
router.post('/add', cartController.addToCart);

// REMOVE FROM CART
router.post('/remove', cartController.removeFromCart);

// VIEW CART
router.get('/', cartController.viewCart);

// CHECKOUT PAGE
router.get('/checkout', isLoggedIn, cartController.viewCheckout);

// PLACE ORDER
router.post('/checkout', isLoggedIn, cartController.placeOrder);

module.exports = router;