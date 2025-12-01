const express = require('express');
const router = express.Router();
const {
    getUsers,
    updateUser,
    deleteUser,
    getAllOrders,
    updateOrderStatus,
    getSellerRequests,
    approveSellerRequest,
    rejectSellerRequest,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.route('/users').get(protect, authorize('admin'), getUsers);
router
    .route('/users/:id')
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser);

router.route('/orders').get(protect, authorize('admin'), getAllOrders);
router.route('/orders/:id').put(protect, authorize('admin'), updateOrderStatus);

router.route('/seller-requests').get(protect, authorize('admin'), getSellerRequests);
router.route('/seller-requests/:id/approve').put(protect, authorize('admin'), approveSellerRequest);
router.route('/seller-requests/:id/reject').put(protect, authorize('admin'), rejectSellerRequest);

module.exports = router;
