const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");

mongoose.connect('mongodb://127.0.0.1:27017/ReadingsDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const Product = require("./models/Products");

const app = express();

app.use(expressLayouts);


app.set("view engine", "ejs");

app.set("layout", "./layouts/main");


app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.render("index");
});


app.get("/fiction", async (req, res) => {

    const products = await Product.find({
        category: "Fiction"
    });

    res.render("category", {

        products,

        categoryName: "Fiction Books"
    });
});

app.get("/non-fiction", async (req, res) => {

    const products = await Product.find({
        category: "Non-Fiction"
    });

    res.render("category", {

        products,

        categoryName: "Non-Fiction Books"
    });
});



app.get("/children", async (req, res) => {

    const products = await Product.find({
        category: "Children"
    });

    res.render("category", {

        products,

        categoryName: "Children Books"
    });
});

app.get("/stationery", async (req, res) => {

    const products = await Product.find({
        category: "Stationery"
    });

    res.render("category", {

        products,

        categoryName: "Stationery"
    });
});


app.get("/toys", async (req, res) => {

    const products = await Product.find({
        category: "Toys"
    });

    res.render("category", {

        products,

        categoryName: "Toys & Games"
    });
});


app.get("/fiction/romance", (req, res) => {
    res.send("Romance Page");
});

app.get("/fiction/mystery", (req, res) => {
    res.send("Mystery Page");
});

app.get("/fiction/fantasy", (req, res) => {
    res.send("Fantasy Page");
});

app.get("/non-fiction/biography", (req, res) => {
    res.send("Biography Page");
});

app.get("/non-fiction/self-help", (req, res) => {
    res.send("Self Help Page");
});

app.get("/non-fiction/history", (req, res) => {
    res.send("History Page");
});



app.get("/children/storybooks", (req, res) => {
    res.send("Story Books Page");
});

app.get("/children/activitybooks", (req, res) => {
    res.send("Activity Books Page");
});

app.get("/children/learning", (req, res) => {
    res.send("Learning Page");
});


app.get("/stationery/notebooks", (req, res) => {
    res.send("Notebooks Page");
});

app.get("/stationery/artsupplies", (req, res) => {
    res.send("Art Supplies Page");
});

app.get("/stationery/schoolitems", (req, res) => {
    res.send("School Items Page");
});


app.get("/toys/boardgames", (req, res) => {
    res.send("Board Games Page");
});

app.get("/toys/puzzles", (req, res) => {
    res.send("Puzzles Page");
});

app.get("/toys/educationaltoys", (req, res) => {
    res.send("Educational Toys Page");
});





app.get("/login", (req, res) => {
    res.render("login");
});


app.get("/register", (req, res) => {
    res.render("register");
});


app.get("/discounts", (req, res) => {
    res.render("discounts");
});




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

console.log("QUERY:", query);
console.log("PRODUCTS FOUND:", products.length);
console.log(products);

        
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

app.get("/products/:id", async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.send("Product not found");
        }

        res.render("product-details", { product });

    } catch (err) {

        console.log(err);

        res.send("Server Error");
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});