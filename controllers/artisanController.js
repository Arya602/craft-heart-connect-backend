const Artisan = require('../models/Artisan');
const asyncHandler = require('express-async-handler');

// @desc    Get all artisans for a seller
// @route   GET /api/artisans
// @access  Private/Seller
const getArtisans = asyncHandler(async (req, res) => {
    const artisans = await Artisan.find({ seller: req.user._id });
    res.json(artisans);
});

// @desc    Get artisan by ID
// @route   GET /api/artisans/:id
// @access  Public
const getArtisanById = asyncHandler(async (req, res) => {
    const artisan = await Artisan.findById(req.params.id);

    if (artisan) {
        res.json(artisan);
    } else {
        res.status(404);
        throw new Error('Artisan not found');
    }
});

// @desc    Create a new artisan
// @route   POST /api/artisans
// @access  Private/Seller
const createArtisan = asyncHandler(async (req, res) => {
    const { name, age, craft, experience, location, image, story } = req.body;

    const artisan = new Artisan({
        seller: req.user._id,
        name,
        age,
        craft,
        experience,
        location,
        image,
        story,
    });

    const createdArtisan = await artisan.save();
    res.status(201).json(createdArtisan);
});

// @desc    Update artisan
// @route   PUT /api/artisans/:id
// @access  Private/Seller
const updateArtisan = asyncHandler(async (req, res) => {
    const { name, age, craft, experience, location, image, story } = req.body;

    const artisan = await Artisan.findById(req.params.id);

    if (artisan) {
        if (artisan.seller.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this artisan');
        }

        artisan.name = name || artisan.name;
        artisan.age = age || artisan.age;
        artisan.craft = craft || artisan.craft;
        artisan.experience = experience || artisan.experience;
        artisan.location = location || artisan.location;
        artisan.image = image || artisan.image;
        artisan.story = story || artisan.story;

        const updatedArtisan = await artisan.save();
        res.json(updatedArtisan);
    } else {
        res.status(404);
        throw new Error('Artisan not found');
    }
});

// @desc    Delete artisan
// @route   DELETE /api/artisans/:id
// @access  Private/Seller
const deleteArtisan = asyncHandler(async (req, res) => {
    const artisan = await Artisan.findById(req.params.id);

    if (artisan) {
        if (artisan.seller.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this artisan');
        }

        await artisan.deleteOne();
        res.json({ message: 'Artisan removed' });
    } else {
        res.status(404);
        throw new Error('Artisan not found');
    }
});

module.exports = {
    getArtisans,
    getArtisanById,
    createArtisan,
    updateArtisan,
    deleteArtisan,
};
