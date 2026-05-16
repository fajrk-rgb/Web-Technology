const express = require('express');

const router = express.Router();

const multer = require('multer');

const path = require('path');

const fs = require('fs');

const Product = require('../../models/Products');



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

router.get('/', async (req, res) => {

    const products =
        await Product.find();

    res.render('admin/products/index', {

        title: 'Manage Products',

        products
    });
});



// ADD PAGE

router.get('/add', (req, res) => {

    res.render('admin/products/add', {

        title: 'Add Product'
    });
});



// ADD PRODUCT

router.post(
    '/add',
    upload.single('image'),

    async (req, res) => {

       const {
       name,
       price,
       category,
       rating,
       stock,
       featuredSections
    } = req.body;

        let imageUrl =
            '/assets/default.jpg';

        if (req.file) {

            imageUrl =
                '/uploads/' +
                req.file.filename;
        }

        await Product.create({

            name,

            price,

            category,

            rating,

            stock,

            featuredSections: featuredSections
            ? [featuredSections]
            : [],


            image: imageUrl
        });

        res.redirect('/admin/products');
    }
);



// EDIT PAGE

router.get('/edit/:id', async (req, res) => {

    const product =
        await Product.findById(req.params.id);

    res.render('admin/products/edit', {

        title: 'Edit Product',

        product
    });
});



// UPDATE PRODUCT

router.post(
    '/edit/:id',
    upload.single('image'),

    async (req, res) => {

    const {
       name,
       price,
       category,
       rating,
       stock,
       featuredSections
    } = req.body;

        const updateData = {

            name,

            price,

            category,

            rating,

            stock,

            featuredSections: featuredSections
        ? [featuredSections]
        : []
        };

        if (req.file) {

            updateData.image =
                '/uploads/' +
                req.file.filename;
        }

        await Product.findByIdAndUpdate(

            req.params.id,

            updateData
        );

        res.redirect('/admin/products');
    }
);



// DELETE PRODUCT

router.post('/delete/:id', async (req, res) => {

    await Product.findByIdAndDelete(
        req.params.id
    );

    res.redirect('/admin/products');
});



module.exports = router;