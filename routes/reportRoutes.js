const express = require('express');
const router = express.Router();
const {
    createReport,
    getReports,
    updateReportStatus,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/rbacMiddleware');

router.route('/')
    .post(protect, createReport)
    .get(protect, authorize('admin'), getReports);

router.route('/:id')
    .put(protect, authorize('admin'), updateReportStatus);

module.exports = router;
