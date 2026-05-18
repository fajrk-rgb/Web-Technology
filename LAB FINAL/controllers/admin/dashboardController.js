const Product = require('../../models/Products');
const Order = require('../../models/Order');

async function getDashboard(req, res) {
  const productCount = await Product.countDocuments();
  const categories = await Product.distinct('category');
  const categoryCount = categories.length;
  const orderCount = await Order.countDocuments();

  res.render('admin/dashboard', {
    title: 'Dashboard',
    productCount,
    categoryCount,
    orderCount
  });
}

module.exports = {
  getDashboard
};
