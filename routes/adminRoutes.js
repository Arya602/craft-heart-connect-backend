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
    issueWarning,
    suspendAccount,
    banUser,
    unbanUser,
    banProduct,
    unbanProduct,
    getAdminActions,
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

// Admin action routes
router.route('/users/:id/warn').post(protect, authorize('admin'), issueWarning);
router.route('/users/:id/suspend').post(protect, authorize('admin'), suspendAccount);
router.route('/users/:id/ban').post(protect, authorize('admin'), banUser);
router.route('/users/:id/unban').post(protect, authorize('admin'), unbanUser);
router.route('/products/:id/ban').post(protect, authorize('admin'), banProduct);
router.route('/products/:id/unban').post(protect, authorize('admin'), unbanProduct);
router.route('/actions').get(protect, authorize('admin'), getAdminActions);

module.exports = router;
