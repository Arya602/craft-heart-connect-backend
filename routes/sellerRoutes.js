const express = require('express');
const router = express.Router();
const { requestSellerRole, getSellerStatus } = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, requestSellerRole);
router.get('/status', protect, getSellerStatus);

module.exports = router;
