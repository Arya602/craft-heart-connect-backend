const Item = require('../models/Item');

// @desc    Get items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
    const items = await Item.find();
    res.status(200).json(items);
};

// @desc    Set item
// @route   POST /api/items
// @access  Private
const setItem = async (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({ message: 'Please add a name and price' });
    }

    let imageUrl = '';
    if (req.file) {
        imageUrl = req.file.path;
    }

    const item = await Item.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrl: imageUrl,
        user: req.user.id,
    });

    res.status(200).json(item);
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        return res.status(400).json({ message: 'Item not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the item user
    if (item.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedItem);
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        return res.status(400).json({ message: 'Item not found' });
    }

    // Check for user
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the item user
    if (item.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await item.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getItems,
    setItem,
    updateItem,
    deleteItem,
};
