const express = require("express");
const path = require("path");

const app = express();

// Set EJS as view engine
app.set("view engine", "ejs");

// Set views folder
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// ================= ROUTES =================

// Home page
app.get("/", (req, res) => {
    res.render("index");
});

// Main categories
app.get("/fiction", (req, res) => {
    res.render("fiction");
});

app.get("/non-fiction", (req, res) => {
    res.render("nonfiction");
});

app.get("/children", (req, res) => {
    res.render("children");
});

app.get("/stationery", (req, res) => {
    res.render("stationery");
});

app.get("/toys", (req, res) => {
    res.render("toys");
});

// Subcategories (optional but good)
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


// ================= CHILDREN =================
app.get("/children/storybooks", (req, res) => {
    res.send("Story Books Page");
});

app.get("/children/activitybooks", (req, res) => {
    res.send("Activity Books Page");
});

app.get("/children/learning", (req, res) => {
    res.send("Learning Page");
});

// ================= STATIONERY =================
app.get("/stationery/notebooks", (req, res) => {
    res.send("Notebooks Page");
});

app.get("/stationery/artsupplies", (req, res) => {
    res.send("Art Supplies Page");
});

app.get("/stationery/schoolitems", (req, res) => {
    res.send("School Items Page");
});

// ================= TOYS =================
app.get("/toys/boardgames", (req, res) => {
    res.send("Board Games Page");
});

app.get("/toys/puzzles", (req, res) => {
    res.send("Puzzles Page");
});

app.get("/toys/educationaltoys", (req, res) => {
    res.send("Educational Toys Page");
});


// Home (already exists)
app.get("/", (req, res) => {
    res.render("index");
});

// Login
app.get("/login", (req, res) => {
    res.render("login");
});

// Register
app.get("/register", (req, res) => {
    res.render("register");
});

// Bank Card Discounts
app.get("/discounts", (req, res) => {
    res.render("discounts");
});

// ==========================================

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});