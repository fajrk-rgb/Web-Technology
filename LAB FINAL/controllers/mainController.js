const Product = require('../models/Products');

async function getHome(req, res) {
  try {
    const newReleases = await Product.find({
      featuredSections: 'new-release'
    });

    const trending = await Product.find({
      featuredSections: 'trending'
    });

    return res.render('index', {
      newReleases,
      trending
    });
  } catch (err) {
    console.log(err);
    return res.send('Error loading homepage');
  }
}

async function getProductDetails(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.send('Product not found');
    }

    return res.render('product-details', { product });
  } catch (err) {
    console.log(err);
    return res.send('Server Error');
  }
}

async function serveCategoryPage(req, res, categoryValue, categoryTitle) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({
      category: { $regex: `^${categoryValue}$`, $options: 'i' }
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const products = await Product.find({
      category: { $regex: `^${categoryValue}$`, $options: 'i' }
    })
      .skip(skip)
      .limit(limit);

    return res.render('category', {
      products,
      categoryName: categoryTitle,
      currentPage: page,
      totalPages
    });
  } catch (err) {
    console.log(err);
    return res.send('Server Error');
  }
}

async function getAllProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = req.query.minPrice || 0;
    const maxPrice = req.query.maxPrice || 100000;

    const query = {
      name: {
        $regex: search,
        $options: 'i'
      },
      price: {
        $gte: Number(minPrice),
        $lte: Number(maxPrice)
      }
    };

    if (category) {
      query.category = {
        $regex: `^${category}$`,
        $options: 'i'
      };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ price: 1 });

    return res.render('products', {
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
    return res.send('Server Error');
  }
}

async function getOnSaleProducts(req, res) {
  try {
    const products = await Product.find({ isOnSale: true });

    return res.render('onsale', { products });
  } catch (err) {
    console.log(err);
    return res.send('Server Error');
  }
}

module.exports = {
  getHome,
  getProductDetails,
  serveCategoryPage,
  getAllProducts,
  getOnSaleProducts
};
