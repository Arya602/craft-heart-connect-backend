const mongoose = require('mongoose');

const adminActionSchema = mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        actionType: {
            type: String,
            enum: ['warning', 'suspension', 'ban', 'unban', 'report_action', 'product_ban', 'product_unban'],
            required: true,
        },
        targetType: {
            type: String,
            enum: ['User', 'Product'],
            required: true,
        },
        target: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'targetType',
        },
        reason: {
            type: String,
            required: true,
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        relatedReport: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const AdminAction = mongoose.model('AdminAction', adminActionSchema);

module.exports = AdminAction;
