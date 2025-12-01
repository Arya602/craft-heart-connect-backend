const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Follow a user
// @route   POST /api/users/follow/:id
// @access  Private
const followUser = async (req, res) => {
    if (req.user._id.toString() === req.params.id) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (userToFollow && currentUser) {
        if (!userToFollow.followers.includes(req.user._id)) {
            await userToFollow.updateOne({ $push: { followers: req.user._id } });
            await currentUser.updateOne({ $push: { following: req.params.id } });

            // Create notification
            await Notification.create({
                user: userToFollow._id,
                message: `${currentUser.username} started following you`,
                type: 'follow',
            });

            res.status(200).json({ message: 'User followed' });
        } else {
            res.status(400).json({ message: 'You already follow this user' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Unfollow a user
// @route   POST /api/users/unfollow/:id
// @access  Private
const unfollowUser = async (req, res) => {
    if (req.user._id.toString() === req.params.id) {
        return res.status(400).json({ message: 'You cannot unfollow yourself' });
    }

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (userToUnfollow && currentUser) {
        if (userToUnfollow.followers.includes(req.user._id)) {
            await userToUnfollow.updateOne({ $pull: { followers: req.user._id } });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            res.status(200).json({ message: 'User unfollowed' });
        } else {
            res.status(400).json({ message: 'You do not follow this user' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id
// @access  Private
const markNotificationRead = async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        notification.read = true;
        await notification.save();
        res.json({ message: 'Notification marked as read' });
    } else {
        res.status(404).json({ message: 'Notification not found' });
    }
};

// @desc    Update user profile (including workshop)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        // Update workshop details if provided
        if (req.body.workshop) {
            user.workshop = {
                ...user.workshop,
                ...req.body.workshop
            };
        }

        // Update story if provided
        if (req.body.story) {
            user.story = req.body.story;
        }

        // Update craft if provided
        if (req.body.craft) {
            user.craft = req.body.craft;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            roles: updatedUser.roles,
            workshop: updatedUser.workshop,
            story: updatedUser.story,
            craft: updatedUser.craft,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all artisans (sellers)
// @route   GET /api/users/artisans
// @access  Public
const getArtisans = async (req, res) => {
    try {
        const artisans = await User.find({ roles: 'seller' })
            .select('-password -refreshToken')
            .sort({ createdAt: -1 });
        res.json(artisans);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    followUser,
    unfollowUser,
    getNotifications,
    markNotificationRead,
    getArtisans,
    updateUserProfile,
};
