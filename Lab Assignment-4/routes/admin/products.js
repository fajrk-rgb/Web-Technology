const express = require('express');

const router = express.Router();

const multer = require('multer');

const path = require('path');

const fs = require('fs');

const productsController = require('../../controllers/admin/productsController');



// ENSURE UPLOADS FOLDER EXISTS

const uploadDir =
    path.join(__dirname, '../../public/uploads');

if (!fs.existsSync(uploadDir)) {

    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}



// MULTER CONFIG

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, 'public/uploads/');
    },

    filename: function (req, file, cb) {

        cb(
            null,
            Date.now() + '-' + file.originalname
        );
    }
});

const upload = multer({
    storage: storage
});



// ALL PRODUCTS

router.get('/', productsController.listProducts);



// ADD PAGE

router.get('/add', productsController.showAddForm);



// ADD PRODUCT

router.post(
    '/add',
    upload.single('image'),
    productsController.addProduct
);



// EDIT PAGE

router.get('/edit/:id', productsController.showEditForm);



// UPDATE PRODUCT

router.post(
    '/edit/:id',
    upload.single('image'),
    productsController.updateProduct
);



// DELETE PRODUCT

router.post('/delete/:id', productsController.deleteProduct);



module.exports = router;