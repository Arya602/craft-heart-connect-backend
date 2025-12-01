const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get sales data for charts
// @route   GET /api/analytics/sales
// @access  Private/Seller/Admin
const getSalesData = async (req, res) => {
    try {
        // If seller, filter by their products
        let matchStage = {
            isPaid: true,
            paidAt: { $exists: true }
        };

        if (req.user.roles.includes('seller') && !req.user.roles.includes('admin')) {
            const sellerProducts = await Product.find({ user: req.user._id }).select('_id');
            const productIds = sellerProducts.map(p => p._id);
            matchStage['orderItems.product'] = { $in: productIds };
        }

        const salesData = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
                    totalSales: { $sum: "$totalPrice" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 } // Last 30 days with data
        ]);

        res.json(salesData);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Error fetching analytics data', error: error.message });
    }
};

module.exports = {
    getSalesData,
};
