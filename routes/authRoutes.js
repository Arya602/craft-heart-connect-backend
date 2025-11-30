const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    refresh,
    logoutUser
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', refresh);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
