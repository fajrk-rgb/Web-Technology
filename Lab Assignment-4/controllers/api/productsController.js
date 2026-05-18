const mongoose = require('mongoose');

const Product = require('../../models/Products');

async function listProducts(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 8));
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const category = req.query.category || '';

    const minRaw = req.query.minPrice;
    const maxRaw = req.query.maxPrice;
    const minParsed = minRaw === undefined ? 0 : Number(minRaw);
    const maxParsed = maxRaw === undefined ? 100000 : Number(maxRaw);
    const minPrice = Number.isFinite(minParsed) ? minParsed : 0;
    const maxPrice = Number.isFinite(maxParsed) ? maxParsed : 100000;

    const query = {
      name: {
        $regex: search,
        $options: 'i'
      },
      price: {
        $gte: minPrice,
        $lte: maxPrice
      }
    };

    if (category) {
      query.category = {
        $regex: `^${category}$`,
        $options: 'i'
      };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(totalProducts / limit));

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ price: 1 });

    return res.json({
      data: products,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems: totalProducts
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

async function getProduct(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product id' });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ data: product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = {
  listProducts,
  getProduct
};
