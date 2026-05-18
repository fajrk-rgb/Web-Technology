const Product = require('../../models/Products');

async function listProducts(req, res) {
  const products = await Product.find();

  res.render('admin/products/index', {
    title: 'Manage Products',
    products
  });
}

function showAddForm(req, res) {
  res.render('admin/products/add', {
    title: 'Add Product'
  });
}

async function addProduct(req, res) {
  const {
    name,
    price,
    category,
    rating,
    stock,
    featuredSections
  } = req.body;

  let imageUrl = '/assets/default.jpg';

  if (req.file) {
    imageUrl = '/uploads/' + req.file.filename;
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

async function showEditForm(req, res) {
  const product = await Product.findById(req.params.id);

  res.render('admin/products/edit', {
    title: 'Edit Product',
    product
  });
}

async function updateProduct(req, res) {
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
    updateData.image = '/uploads/' + req.file.filename;
  }

  await Product.findByIdAndUpdate(
    req.params.id,
    updateData
  );

  res.redirect('/admin/products');
}

async function deleteProduct(req, res) {
  await Product.findByIdAndDelete(
    req.params.id
  );

  res.redirect('/admin/products');
}

module.exports = {
  listProducts,
  showAddForm,
  addProduct,
  showEditForm,
  updateProduct,
  deleteProduct
};
