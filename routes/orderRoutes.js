const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    updateOrderToCancelled,
    getMyOrders,
    getOrders,
    getSellerOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, authorize('admin'), getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/seller/my-orders').get(protect, authorize('seller', 'admin'), getSellerOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, authorize('admin', 'seller'), updateOrderStatus);
router.route('/:id/cancel').put(protect, updateOrderToCancelled);

module.exports = router;
