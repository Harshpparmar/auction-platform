const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const authMiddleware = require('../middleware/auth');

// Admin route to get all bids
router.get('/admin', authMiddleware, (req, res) => {
    res.json({ message: 'Admin bids route works!' });
});

// Admin route to get all bids with pagination and filtering
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const productId = req.query.product_id;

        const skip = (page - 1) * limit;

        // Build query filter
        const filter = {};
        if (productId) filter.product_id = productId;

        // Get total count for pagination info
        const total = await Bid.countDocuments(filter);

        // Get bids with pagination and populate product details
        const bids = await Bid.find(filter)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .populate('product_id', 'title image_url');

        res.json({
            bids,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching admin bids:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;