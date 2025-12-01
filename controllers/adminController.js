const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password -refreshToken');
    res.json(users);
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.roles) {
            user.roles = req.body.roles;
        }

        // Handle seller approval
        if (req.body.sellerRequest) {
            user.sellerRequest = req.body.sellerRequest;

            // If approving seller, add 'seller' role
            if (req.body.sellerRequest.status === 'approved' && !user.roles.includes('seller')) {
                user.roles.push('seller');
            }
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            roles: updatedUser.roles,
            sellerRequest: updatedUser.sellerRequest,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id username email');
    res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;

        if (req.body.status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get all seller requests
// @route   GET /api/admin/seller-requests
// @access  Private/Admin
const getSellerRequests = async (req, res) => {
    try {
        const status = req.query.status; // pending, approved, rejected, or all

        let query = { 'sellerRequest.status': { $exists: true, $ne: null } };

        if (status && status !== 'all') {
            query['sellerRequest.status'] = status;
        }

        const users = await User.find(query)
            .select('username email craft story workshop sellerRequest createdAt')
            .sort({ 'sellerRequest.requestDate': -1 });

        res.json(users);
    } catch (error) {
        console.error('Get seller requests error:', error);
        res.status(500).json({ message: 'Error fetching seller requests', error: error.message });
    }
};

// @desc    Approve seller request
// @route   PUT /api/admin/seller-requests/:id/approve
// @access  Private/Admin
const approveSellerRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.sellerRequest || user.sellerRequest.status !== 'pending') {
            return res.status(400).json({ message: 'No pending seller request found' });
        }

        user.sellerRequest.status = 'approved';

        // Add seller role if not already present
        if (!user.roles.includes('seller')) {
            user.roles.push('seller');
        }

        await user.save();

        res.json({
            message: 'Seller request approved successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles,
                sellerRequest: user.sellerRequest,
            },
        });
    } catch (error) {
        console.error('Approve seller request error:', error);
        res.status(500).json({ message: 'Error approving seller request', error: error.message });
    }
};

// @desc    Reject seller request
// @route   PUT /api/admin/seller-requests/:id/reject
// @access  Private/Admin
const rejectSellerRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.sellerRequest || user.sellerRequest.status !== 'pending') {
            return res.status(400).json({ message: 'No pending seller request found' });
        }

        user.sellerRequest.status = 'rejected';

        await user.save();

        res.json({
            message: 'Seller request rejected',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                sellerRequest: user.sellerRequest,
            },
        });
    } catch (error) {
        console.error('Reject seller request error:', error);
        res.status(500).json({ message: 'Error rejecting seller request', error: error.message });
    }
};

module.exports = {
    getUsers,
    updateUser,
    deleteUser,
    getAllOrders,
    updateOrderStatus,
    getSellerRequests,
    approveSellerRequest,
    rejectSellerRequest,
};
