const express = require('express');
const router = express.Router();
const {
    getUsers,
    updateUser,
    deleteUser,
    getAllOrders,
    updateOrderStatus,
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

module.exports = router;
