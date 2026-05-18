const Product = require('../models/Products');
const Order = require('../models/Order');

function getCart(req) {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  return req.session.cart;
}

async function addToCart(req, res) {
  const { productId, quantity } = req.body;

  if (!productId) {
    req.flash('error', 'Invalid product');
    return res.redirect('/products');
  }

  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const cart = getCart(req);

  const existing = cart.find(
    item => String(item.productId) === String(productId)
  );

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      productId: String(productId),
      quantity: qty
    });
  }

  req.flash('success', 'Added to cart');
  return res.redirect('/cart');
}

function removeFromCart(req, res) {
  const { productId } = req.body;

  if (!productId) {
    req.flash('error', 'Invalid product');
    return res.redirect('/cart');
  }

  const cart = getCart(req);
  const nextCart = cart.filter(
    item => String(item.productId) !== String(productId)
  );

  req.session.cart = nextCart;
  req.flash('success', 'Item removed from cart');
  return res.redirect('/cart');
}

async function viewCart(req, res) {
  const cart = getCart(req);
  const ids = cart.map(item => item.productId);

  const products = ids.length
    ? await Product.find({ _id: { $in: ids } })
    : [];

  const productMap = new Map(
    products.map(product => [String(product._id), product])
  );

  const items = cart
    .map(item => {
      const product = productMap.get(String(item.productId));

      if (!product) return null;

      return {
        product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    })
    .filter(Boolean);

  const total = items.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  res.render('cart', {
    items,
    total
  });
}

async function viewCheckout(req, res) {
  const cart = getCart(req);
  const ids = cart.map(item => item.productId);

  const products = ids.length
    ? await Product.find({ _id: { $in: ids } })
    : [];

  const productMap = new Map(
    products.map(product => [String(product._id), product])
  );

  const items = cart
    .map(item => {
      const product = productMap.get(String(item.productId));

      if (!product) return null;

      return {
        product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    })
    .filter(Boolean);

  const total = items.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  res.render('checkout', {
    user: req.session.user,
    total
  });
}

async function placeOrder(req, res) {
  const { name, phone, address, city } = req.body;

  if (!name || !phone || !address || !city) {
    req.flash('error', 'All fields are required');
    return res.redirect('/cart/checkout');
  }

  const cart = getCart(req);

  if (!cart.length) {
    req.flash('error', 'Cart is empty');
    return res.redirect('/cart');
  }

  const ids = cart.map(item => item.productId);

  const products = await Product.find({
    _id: { $in: ids }
  });

  const productMap = new Map(
    products.map(product => [String(product._id), product])
  );

  const orderItems = cart.map(item => {
    const product = productMap.get(String(item.productId));

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  await Order.create({
    user: req.session.user.id,
    customerName: name,
    phone,
    address,
    city,
    items: orderItems,
    totalAmount
  });

  req.session.cart = [];

  req.flash('success', 'Order placed successfully');
  return res.redirect('/');
}

module.exports = {
  addToCart,
  removeFromCart,
  viewCart,
  viewCheckout,
  placeOrder
};
