const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    image_url: String,
    starting_bid: Number,
    is_active: { type: Boolean, default: false },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);