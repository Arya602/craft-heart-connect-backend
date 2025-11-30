const Wishlist = require('../models/Wishlist');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (wishlist) {
        res.json(wishlist.products);
    } else {
        res.json([]);
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:id
// @access  Private
const addToWishlist = async (req, res) => {
    const productId = req.params.id;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
        // Check if product already in wishlist
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        wishlist.products.push(productId);
    } else {
        wishlist = new Wishlist({
            user: req.user._id,
            products: [productId],
        });
    }

    await wishlist.save();
    res.status(201).json({ message: 'Product added to wishlist' });
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
    const productId = req.params.id;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
        wishlist.products = wishlist.products.filter(
            (product) => product.toString() !== productId
        );
        await wishlist.save();
        res.json({ message: 'Product removed from wishlist' });
    } else {
        res.status(404).json({ message: 'Wishlist not found' });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
