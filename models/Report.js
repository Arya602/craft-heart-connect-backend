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
        status: {
            type: String,
            enum: ['pending', 'resolved', 'dismissed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
