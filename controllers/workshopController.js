const Workshop = require('../models/Workshop');
const asyncHandler = require('express-async-handler');

// @desc    Get all workshops for a seller
// @route   GET /api/workshops
// @access  Private/Seller
const getWorkshops = asyncHandler(async (req, res) => {
    const workshops = await Workshop.find({ seller: req.user._id }).populate('artisan', 'name');
    res.json(workshops);
});

// @desc    Get workshop by ID
// @route   GET /api/workshops/:id
// @access  Public
const getWorkshopById = asyncHandler(async (req, res) => {
    const workshop = await Workshop.findById(req.params.id).populate('artisan', 'name image');

    if (workshop) {
        res.json(workshop);
    } else {
        res.status(404);
        throw new Error('Workshop not found');
    }
});

// @desc    Create a new workshop
// @route   POST /api/workshops
// @access  Private/Seller
const createWorkshop = asyncHandler(async (req, res) => {
    const { title, description, schedule, duration, price, maxSeats, location, images, artisan } = req.body;

    const workshop = new Workshop({
        seller: req.user._id,
        title,
        description,
        schedule,
        duration,
        price,
        maxSeats,
        location,
        images,
        artisan,
    });

    const createdWorkshop = await workshop.save();
    res.status(201).json(createdWorkshop);
});

// @desc    Update workshop
// @route   PUT /api/workshops/:id
// @access  Private/Seller
const updateWorkshop = asyncHandler(async (req, res) => {
    const { title, description, schedule, duration, price, maxSeats, location, images, artisan } = req.body;

    const workshop = await Workshop.findById(req.params.id);

    if (workshop) {
        if (workshop.seller.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this workshop');
        }

        workshop.title = title || workshop.title;
        workshop.description = description || workshop.description;
        workshop.schedule = schedule || workshop.schedule;
        workshop.duration = duration || workshop.duration;
        workshop.price = price || workshop.price;
        workshop.maxSeats = maxSeats || workshop.maxSeats;
        workshop.location = location || workshop.location;
        workshop.images = images || workshop.images;
        workshop.artisan = artisan || workshop.artisan;

        const updatedWorkshop = await workshop.save();
        res.json(updatedWorkshop);
    } else {
        res.status(404);
        throw new Error('Workshop not found');
    }
});

// @desc    Delete workshop
// @route   DELETE /api/workshops/:id
// @access  Private/Seller
const deleteWorkshop = asyncHandler(async (req, res) => {
    const workshop = await Workshop.findById(req.params.id);

    if (workshop) {
        if (workshop.seller.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this workshop');
        }

        await workshop.deleteOne();
        res.json({ message: 'Workshop removed' });
    } else {
        res.status(404);
        throw new Error('Workshop not found');
    }
});

// @desc    Register for workshop
// @route   POST /api/workshops/:id/register
// @access  Private
const registerForWorkshop = asyncHandler(async (req, res) => {
    const workshop = await Workshop.findById(req.params.id);

    if (workshop) {
        // Check if already registered
        const alreadyRegistered = workshop.registrations.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyRegistered) {
            res.status(400);
            throw new Error('Already registered for this workshop');
        }

        // Check if seats available
        const confirmedRegistrations = workshop.registrations.filter(r => r.status === 'confirmed');
        if (confirmedRegistrations.length >= workshop.maxSeats) {
            res.status(400);
            throw new Error('Workshop is full');
        }

        const registration = {
            user: req.user._id,
            status: 'confirmed',
            registeredAt: Date.now(),
        };

        workshop.registrations.push(registration);
        await workshop.save();

        res.status(201).json({ message: 'Registration successful' });
    } else {
        res.status(404);
        throw new Error('Workshop not found');
    }
});

module.exports = {
    getWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    registerForWorkshop,
};
