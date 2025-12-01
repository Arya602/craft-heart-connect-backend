const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    // Category filter
    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    // Price range filter
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
        priceFilter.price = {};
        if (req.query.minPrice) {
            priceFilter.price.$gte = Number(req.query.minPrice);
        }
        if (req.query.maxPrice) {
            priceFilter.price.$lte = Number(req.query.maxPrice);
        }
    }

    // Geospatial Query
    let geoQuery = {};
    if (req.query.lat && req.query.lng) {
        geoQuery = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
                    },
                    $maxDistance: 100000, // 100km
                },
            },
        };
    }

    const filters = { ...keyword, ...categoryFilter, ...priceFilter, ...geoQuery };
    const count = await Product.countDocuments(filters);
    const products = await Product.find(filters)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('user', 'username email');

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller/Admin
const createProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock, lat, lng } = req.body;

    let location = undefined;
    if (lat && lng) {
        location = {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
        };
    }

    const product = new Product({
        name: name || 'Sample Name',
        price: price || 0,
        user: req.user._id,
        image: image || '/images/sample.jpg',
        brand: brand || 'Sample Brand',
        category: category || 'Sample Category',
        countInStock: countInStock || 0,
        numReviews: 0,
        description: description || 'Sample description',
        location: location,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller/Admin
const updateProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock, lat, lng } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        // Check ownership or admin
        if (product.user.toString() !== req.user.id && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;

        if (lat && lng) {
            product.location = {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)],
            };
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        // Check ownership or admin
        if (product.user.toString() !== req.user.id && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = {
            name: req.user.username,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Get seller's products
// @route   GET /api/products/seller/my-products
// @access  Private/Seller
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Get my products error:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getMyProducts,
};
