const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            trackingUpdates: [
                {
                    status: 'pending',
                    message: 'Order placed successfully',
                },
            ],
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            message: 'Error creating order',
            error: error.message,
            details: error.errors
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'username email'
    );

    if (order) {
        // Check if user is owner or admin
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Update order status (shipped/delivered)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Seller
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        order.status = status || order.status;

        // Add tracking update
        order.trackingUpdates.push({
            status: status,
            message: `Order marked as ${status}`,
            timestamp: Date.now()
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id username');
    res.json(orders);
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const updateOrderToCancelled = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.user.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.status === 'delivered' || order.status === 'shipped') {
            return res.status(400).json({ message: 'Cannot cancel shipped or delivered order' });
        }

        order.status = 'cancelled';
        order.trackingUpdates.push({
            status: 'cancelled',
            message: 'Order cancelled by user',
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get seller's orders (orders containing seller's products)
// @route   GET /api/orders/seller/my-orders
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
    try {
        const Product = require('../models/Product');

        // Get all products by this seller
        const sellerProducts = await Product.find({ user: req.user._id }).select('_id');
        const productIds = sellerProducts.map(p => p._id);

        // Find orders that contain any of the seller's products
        const orders = await Order.find({
            'orderItems.product': { $in: productIds }
        }).populate('user', 'username email').sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Get seller orders error:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    updateOrderToCancelled,
    getMyOrders,
    getOrders,
    getSellerOrders,
};
