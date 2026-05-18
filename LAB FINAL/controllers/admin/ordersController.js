const Order = require('../../models/Order');

async function listOrders(req, res) {
  const orders = await Order.find()
    .sort({ createdAt: -1 });

  res.render('admin/orders/index', {
    title: 'Orders',
    orders
  });
}

module.exports = {
  listOrders
};
