const mongoose = require('mongoose');

const workshopSchema = mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        schedule: {
            type: Date,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        maxSeats: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
            },
        ],
        artisan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artisan',
            required: false,
        },
        registrations: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                status: {
                    type: String,
                    enum: ['confirmed', 'cancelled', 'attended'],
                    default: 'confirmed',
                },
                registeredAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Workshop = mongoose.model('Workshop', workshopSchema);

module.exports = Workshop;
