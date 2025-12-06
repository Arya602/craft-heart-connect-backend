const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AdminAction = require('../models/AdminAction');
const asyncHandler = require('express-async-handler');

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

// @desc    Issue warning to user
// @route   POST /api/admin/users/:id/warn
// @access  Private/Admin
const issueWarning = asyncHandler(async (req, res) => {
    const { reason, severity } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Add warning to user
    user.warnings.push({
        issuedBy: req.user._id,
        reason,
        severity: severity || 'medium',
        issuedAt: new Date(),
    });

    await user.save();

    // Log admin action
    await AdminAction.create({
        admin: req.user._id,
        actionType: 'warning',
        targetType: 'User',
        target: user._id,
        reason,
        details: { severity },
    });

    res.json({ message: 'Warning issued successfully', warnings: user.warnings });
});

// @desc    Suspend user account
// @route   POST /api/admin/users/:id/suspend
// @access  Private/Admin
const suspendAccount = asyncHandler(async (req, res) => {
    const { reason, duration } = req.body; // duration in days
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const suspendedUntil = new Date();
    suspendedUntil.setDate(suspendedUntil.getDate() + (duration || 7));

    user.accountStatus.isSuspended = true;
    user.accountStatus.suspendedUntil = suspendedUntil;
    user.accountStatus.suspensionReason = reason;
    user.accountStatus.isActive = false;

    await user.save();

    // Log admin action
    await AdminAction.create({
        admin: req.user._id,
        actionType: 'suspension',
        targetType: 'User',
        target: user._id,
        reason,
        details: { duration, suspendedUntil },
    });

    res.json({
        message: 'Account suspended successfully',
        suspendedUntil,
        accountStatus: user.accountStatus
    });
});

// @desc    Ban user permanently
// @route   POST /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.accountStatus.isBanned = true;
    user.accountStatus.banReason = reason;
    user.accountStatus.isActive = false;
    user.accountStatus.isSuspended = false;

    await user.save();

    // Log admin action
    await AdminAction.create({
        admin: req.user._id,
        actionType: 'ban',
        targetType: 'User',
        target: user._id,
        reason,
    });

    res.json({ message: 'User banned permanently', accountStatus: user.accountStatus });
});

// @desc    Unban user
// @route   POST /api/admin/users/:id/unban
// @access  Private/Admin
const unbanUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.accountStatus.isBanned = false;
    user.accountStatus.banReason = '';
    user.accountStatus.isActive = true;
    user.accountStatus.isSuspended = false;
    user.accountStatus.suspendedUntil = null;

    await user.save();

    // Log admin action
    await AdminAction.create({
        admin: req.user._id,
        actionType: 'unban',
        targetType: 'User',
        target: user._id,
        reason: 'Account unbanned by admin',
    });

    res.json({ message: 'User unbanned successfully', accountStatus: user.accountStatus });
});

// @desc    Ban product
// @route   POST /api/admin/products/:id/ban
// @access  Private/Admin
const banProduct = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    product.isBanned = true;
    product.banReason = reason;
    product.bannedAt = new Date();
    product.bannedBy = req.user._id;

    await product.save();

    // Log admin action
    await AdminAction.create({
        admin: req.user._id,
        actionType: 'product_ban',
        targetType: 'Product',
        target: product._id,
        reason,
    });

    res.json({ message: 'Product banned successfully', product });
});

// @desc    Unban product
// @route   POST /api/admin/products/:id/unban
// @access  Private/Admin
const unbanProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    product.isBanned = false;
    product.banReason = '';
    product.bannedAt = null;
    product.bannedBy = null;

    await product.save();

    // Log admin action
    await AdminAction.create({
        admin: req.user._id,
        actionType: 'product_unban',
        targetType: 'Product',
        target: product._id,
        reason: 'Product unbanned by admin',
    });

    res.json({ message: 'Product unbanned successfully', product });
});

// @desc    Get admin actions (audit log)
// @route   GET /api/admin/actions
// @access  Private/Admin
const getAdminActions = asyncHandler(async (req, res) => {
    const { limit = 50, actionType, targetType } = req.query;

    let query = {};
    if (actionType) query.actionType = actionType;
    if (targetType) query.targetType = targetType;

    const actions = await AdminAction.find(query)
        .populate('admin', 'username email')
        .populate('target')
        .populate('relatedReport')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

    res.json(actions);
});

module.exports = {
    getUsers,
    updateUser,
    deleteUser,
    getAllOrders,
    updateOrderStatus,
    getSellerRequests,
    approveSellerRequest,
    rejectSellerRequest,
    issueWarning,
    suspendAccount,
    banUser,
    unbanUser,
    banProduct,
    unbanProduct,
    getAdminActions,
};
