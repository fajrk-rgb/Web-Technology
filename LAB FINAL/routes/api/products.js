const express = require('express');
const productsController = require('../../controllers/api/productsController');

const router = express.Router();

router.get('/', productsController.listProducts);
router.get('/:id', productsController.getProduct);

module.exports = router;
