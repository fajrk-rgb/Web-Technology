const express = require('express');

const mainController = require('../controllers/mainController');

const router = express.Router();

router.get('/', mainController.getHome);

router.get('/products', mainController.getAllProducts);
router.get('/products/:id', mainController.getProductDetails);

router.get('/fiction', (req, res) =>
  mainController.serveCategoryPage(req, res, 'fiction', 'Fiction Books')
);

router.get('/non-fiction', (req, res) =>
  mainController.serveCategoryPage(req, res, 'non-fiction', 'Non-Fiction Books')
);

router.get('/children', (req, res) =>
  mainController.serveCategoryPage(req, res, 'children', 'Children Books')
);

router.get('/stationery', (req, res) =>
  mainController.serveCategoryPage(req, res, 'stationery', 'Stationery')
);

router.get('/toys', (req, res) =>
  mainController.serveCategoryPage(req, res, 'toys', 'Toys & Games')
);

module.exports = router;
