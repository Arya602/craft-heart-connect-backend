const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        imageUrl: {
            type: String,
            required: false,
        },
        category: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
