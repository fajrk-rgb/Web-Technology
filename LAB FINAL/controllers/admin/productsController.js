const Product = require('../../models/Products');

function parseBoolean(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return undefined;
    }

    value = value[value.length - 1];
  }

  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  const normalized = String(value).trim().toLowerCase();

  if (
    normalized === 'true'
    || normalized === '1'
    || normalized === 'yes'
    || normalized === 'on'
  ) {
    return true;
  }

  if (
    normalized === 'false'
    || normalized === '0'
    || normalized === 'no'
    || normalized === 'off'
  ) {
    return false;
  }

  return undefined;
}

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
    featuredSections,
    isOnSale
  } = req.body;

  console.log('[addProduct] isOnSale raw:', isOnSale);

  const isOnSaleValue = parseBoolean(isOnSale);

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

    isOnSale: isOnSaleValue ?? false,

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
  console.log(" updateProduct HIT");
  const {
    name,
    price,
    category,
    rating,
    stock,
    featuredSections,
    isOnSale
  } = req.body;

  console.log('[updateProduct] isOnSale raw:', isOnSale);

  const isOnSaleValue = parseBoolean(isOnSale);

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

  if (isOnSaleValue !== undefined) {
    updateData.isOnSale = isOnSaleValue;
  }

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
