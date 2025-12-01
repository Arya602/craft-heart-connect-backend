const express = require('express');
const router = express.Router();
const { getSalesData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.get('/sales', protect, authorize('seller', 'admin'), getSalesData);

module.exports = router;
