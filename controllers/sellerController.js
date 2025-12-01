const User = require('../models/User');

// @desc    Request seller role
// @route   POST /api/seller/request
// @access  Private
const requestSellerRole = async (req, res) => {
    try {
        const { craft, story, workshop } = req.body;

        // Validate required fields
        if (!craft || !story || !workshop?.name || !workshop?.location) {
            return res.status(400).json({
                message: 'Please provide all required fields: craft, story, workshop name and location'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is already a seller
        if (user.roles.includes('seller')) {
            return res.status(400).json({ message: 'You are already a seller' });
        }

        // Check if there's a pending request
        if (user.sellerRequest?.status === 'pending') {
            return res.status(400).json({ message: 'You already have a pending seller request' });
        }

        // Update user with seller information and auto-approve
        user.craft = craft;
        user.story = story;
        user.workshop = {
            name: workshop.name,
            location: workshop.location,
            description: workshop.description || '',
            image: workshop.image || '',
        };
        user.sellerRequest = {
            status: 'approved',
            requestDate: new Date(),
        };

        // Add seller role
        user.roles.push('seller');

        await user.save();

        res.status(200).json({
            message: 'Seller request approved! You are now a seller.',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles,
                craft: user.craft,
                story: user.story,
                workshop: user.workshop,
            },
        });
    } catch (error) {
        console.error('Seller request error:', error);
        res.status(500).json({
            message: 'Error processing seller request',
            error: error.message
        });
    }
};

// @desc    Get seller request status
// @route   GET /api/seller/status
// @access  Private
const getSellerStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('roles sellerRequest craft story workshop');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            isSeller: user.roles.includes('seller'),
            sellerRequest: user.sellerRequest,
            craft: user.craft,
            story: user.story,
            workshop: user.workshop,
        });
    } catch (error) {
        console.error('Get seller status error:', error);
        res.status(500).json({
            message: 'Error fetching seller status',
            error: error.message
        });
    }
};

module.exports = {
    requestSellerRole,
    getSellerStatus,
};
