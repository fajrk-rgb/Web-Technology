const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const Product = require("./models/Products");

const adminRoutes = require("./routes/admin");
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');

const app = express();


// DATABASE CONNECTION

mongoose.connect("mongodb://127.0.0.1:27017/ReadingsDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));


// MIDDLEWARE

app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

// Sessions & Flash
app.use(session({
    secret: 'replace_this_with_a_secure_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/ReadingsDB' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(flash());

// Make user & flash available in views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// VIEW ENGINE

app.set("view engine", "ejs");

app.set("layout", "./layouts/main");

app.set("views", path.join(__dirname, "views"));


// ADMIN ROUTES

app.use("/admin", adminRoutes);
// Auth routes (login/register/logout)
app.use('/', authRoutes);
// Cart and checkout routes
app.use('/cart', cartRoutes);



// =====================================================
// HOME PAGE
// =====================================================

app.get("/", async (req, res) => {

    try {

        const newReleases = await Product.find({
            featuredSections: "new-release"
        });

        const trending = await Product.find({
            featuredSections: "trending"
        });

        res.render("index", {
            newReleases,
            trending
        });

    } catch (err) {

        console.log(err);

        res.send("Error loading homepage");
    }
});



// =====================================================
// PRODUCT DETAILS PAGE
// =====================================================

app.get("/products/:id", async (req, res) =>
     { try
         { const product = await Product.findById(req.params.id);
             if (!product) { return res.send("Product not found"); 

             } res.render("product-details", { product });
             } catch (err) { console.log(err); 
                res.send("Server Error"); } });



// =====================================================
// CATEGORY ROUTES
// =====================================================
// Helper to serve paginated category pages
async function serveCategoryPage(req, res, categoryValue, categoryTitle) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;

        const total = await Product.countDocuments({
            category: { $regex: `^${categoryValue}$`, $options: "i" }
        });

        const totalPages = Math.max(1, Math.ceil(total / limit));

        const products = await Product.find({
            category: { $regex: `^${categoryValue}$`, $options: "i" }
        })
            .skip(skip)
            .limit(limit);

        res.render("category", {
            products,
            categoryName: categoryTitle,
            currentPage: page,
            totalPages
        });
    } catch (err) {
        console.log(err);
        res.send("Server Error");
    }
}

app.get("/fiction", (req, res) => serveCategoryPage(req, res, "fiction", "Fiction Books"));

app.get("/non-fiction", (req, res) => serveCategoryPage(req, res, "non-fiction", "Non-Fiction Books"));

app.get("/children", (req, res) => serveCategoryPage(req, res, "children", "Children Books"));

app.get("/stationery", (req, res) => serveCategoryPage(req, res, "stationery", "Stationery"));

app.get("/toys", (req, res) => serveCategoryPage(req, res, "toys", "Toys & Games"));






// AUTH PAGES handled in routes/auth.js


// =====================================================
// DISCOUNTS PAGE
// =====================================================

app.get("/discounts", (req, res) => {
    res.render("discounts");
});



// =====================================================
// ALL PRODUCTS PAGE
// =====================================================

app.get("/products", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";

        const category = req.query.category || "";

        const minPrice = req.query.minPrice || 0;

        const maxPrice = req.query.maxPrice || 100000;

        let query = {
            name: {
                $regex: search,
                $options: "i"
            },
            price: {
                $gte: Number(minPrice),
                $lte: Number(maxPrice)
            }
        };

        if (category) {
            query.category = {
                $regex: `^${category}$`,
                $options: "i"
            };
        }

        const totalProducts = await Product.countDocuments(query);

        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ price: 1 });

        res.render("products", {
            products,
            currentPage: page,
            totalPages,
            search,
            category,
            minPrice,
            maxPrice
        });
    } catch (err) {
        console.log(err);
        res.send("Server Error");
    }
});


// =====================================================
// SERVER
// =====================================================

app.get('/test-cart', (req, res) => {
    res.send('Cart routes working');
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
