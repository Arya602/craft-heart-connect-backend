const mongoose = require('mongoose');

const reportSchema = mongoose.Schema(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reportedEntity: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'entityType',
        },
        entityType: {
            type: String,
            required: true,
            enum: ['User', 'Product'],
        },
        reason: {
            type: String,
            required: true,
        },
        details: {
            type: String,
            required: false,
        },
        image: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ['pending', 'verified', 'action_taken', 'dismissed'],
            default: 'pending',
        },
        actionTaken: {
            type: String,
            default: '',
        },
        actionTakenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        actionTakenAt: {
            type: Date,
            default: null,
        },
        adminNotes: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
