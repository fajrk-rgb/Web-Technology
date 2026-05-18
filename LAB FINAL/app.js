const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const { getDisplayPrice } = require('./utils/pricing');

require("dotenv").config();

const adminRoutes = require("./routes/admin");
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const apiRoutes = require('./routes/api');
const mainRoutes = require('./routes/main');

const app = express();




mongoose.connect("mongodb://127.0.0.1:27017/ReadingsDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));



app.use(expressLayouts);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));


app.use(session({
    secret: 'mysecurekey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/ReadingsDB' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(flash());


app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.getDisplayPrice = getDisplayPrice;
    next();
});




app.set("view engine", "ejs");

app.set("layout", "./layouts/main");

app.set("views", path.join(__dirname, "views"));




app.use("/admin", adminRoutes);

app.use('/', authRoutes);

app.use('/cart', cartRoutes);

app.use('/api/v1', apiRoutes);

app.use('/', mainRoutes);




const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
