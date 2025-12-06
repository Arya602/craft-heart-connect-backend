const asyncHandler = require('express-async-handler');
const Report = require('../models/Report');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
const createReport = asyncHandler(async (req, res) => {
    const { reportedEntity, entityType, reason, details, image } = req.body;

    if (!reportedEntity || !entityType || !reason) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const report = await Report.create({
        reporter: req.user._id,
        reportedEntity,
        entityType,
        reason,
        details,
        image,
    });

    res.status(201).json(report);
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
    const reports = await Report.find({})
        .populate('reporter', 'username email')
        .sort({ createdAt: -1 });

    // We need to populate the reportedEntity based on entityType, which is dynamic.
    // Mongoose's populate with refPath handles this, but let's ensure we get the necessary fields.
    const populatedReports = await Report.populate(reports, {
        path: 'reportedEntity',
        select: 'username name title image', // Select common fields for User and Product
    });

    res.json(populatedReports);
});

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
        res.status(404);
        throw new Error('Report not found');
    }

    report.status = status;
    await report.save();

    res.json(report);
});

module.exports = {
    createReport,
    getReports,
    updateReportStatus,
};
