const express = require('express');
const router = express.Router();
const {
    followUser,
    unfollowUser,
    getNotifications,
    markNotificationRead,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id', protect, markNotificationRead);

module.exports = router;
