const mongoose = require('mongoose');

const Order = require('../../models/Order');
const Product = require('../../models/Products');
const { getDisplayPrice, roundMoney } = require('../../utils/pricing');

async function createOrder(req, res) {
  const { name, phone, address, city, items } = req.body;

  if (!name || !phone || !address || !city) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' });
  }

  const normalizedItems = items.map(item => ({
    productId: item.productId,
    quantity: Math.max(1, parseInt(item.quantity, 10) || 1)
  }));

  const invalidIds = normalizedItems
    .filter(item => !mongoose.Types.ObjectId.isValid(item.productId))
    .map(item => item.productId);

  if (invalidIds.length) {
    return res.status(400).json({
      message: 'Invalid product id(s)',
      invalidIds
    });
  }

  try {
    const ids = normalizedItems.map(item => item.productId);
    const products = await Product.find({ _id: { $in: ids } });

    if (products.length !== ids.length) {
      const foundIds = new Set(products.map(product => String(product._id)));
      const missingProductIds = ids.filter(id => !foundIds.has(String(id)));
      return res.status(400).json({
        message: 'Some products were not found',
        missingProductIds
      });
    }

    const productMap = new Map(
      products.map(product => [String(product._id), product])
    );

    const orderItems = normalizedItems.map(item => {
      const product = productMap.get(String(item.productId));
      const unitPrice = getDisplayPrice(product);

      return {
        product: product._id,
        name: product.name,
        price: unitPrice,
        quantity: item.quantity
      };
    });

    const totalAmount = roundMoney(orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    ));

    const order = await Order.create({
      user: req.user.id,
      customerName: name,
      phone,
      address,
      city,
      items: orderItems,
      totalAmount
    });

    return res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
      totalAmount
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Order creation failed' });
  }
}

module.exports = {
  createOrder
};
