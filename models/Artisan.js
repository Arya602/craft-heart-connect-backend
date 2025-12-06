const mongoose = require('mongoose');

const artisanSchema = mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        craft: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        story: {
            bio: { type: String, default: '' },
            journey: { type: String, default: '' },
            inspirations: { type: String, default: '' },
            achievements: { type: String, default: '' },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Artisan = mongoose.model('Artisan', artisanSchema);

module.exports = Artisan;
