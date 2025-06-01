const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    bidder_name: String,
    bidder_email: String,
    amount: Number,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', bidSchema);