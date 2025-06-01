const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Admin route to get all bids with pagination and filtering
router.get("/admin", authMiddleware, async (req, res) => {
    try {
        // Parse pagination and filter parameters
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

        // Always return 200 with array (even if empty)
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

// Get bids for a specific product
router.get("/:productId", async (req, res) => {
    const { productId } = req.params;

    // Validate productId
    try {
        const bids = await Bid.find({ product_id: productId })
            .sort({ created_at: -1 })
            .limit(10);

        // Always return 200 with array (even if empty)
        return res.status(200).json(bids);
    } catch (err) {
        console.error("Error in GET /api/bids/:productId:", err);
        res.status(500).json({ message: "Failed to fetch bids", error: err.message });
    }
});

// Place a new bid
router.post('/', async (req, res) => {
    try {
        // Validate request body
        const { product_id, bidder_name, bidder_email, amount } = req.body;

        // Basic validation
        if (!product_id || !bidder_name || !bidder_email || !amount) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        const lastBid = await Bid.findOne({ product_id })
            .sort({ created_at: -1 })
            .limit(1);

        // Check if the last bid was placed by the same bidder
        if (lastBid && lastBid.bidder_email.toLowerCase() === bidder_email.toLowerCase()) {
            return res.status(400).json({
                message: "You cannot place consecutive bids. Please wait for someone else to bid."
            })
        }

        // Check if product exists
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get highest bid
        const highestBid = await Bid.findOne({ product_id })
            .sort({ amount: -1 });

        // Determine minimum bid amount
        const minBidAmount = highestBid ? highestBid.amount : product.starting_bid;

        // Validate bid amount
        if (amount <= minBidAmount) {
            return res.status(400).json({
                message: 'Bid must be higher than current highest bid or starting bid',
                current_highest: minBidAmount
            });
        }

        // Create new bid
        const newBid = new Bid({
            product_id,
            bidder_name,
            bidder_email,
            amount: Number(amount)
        });

        await newBid.save();

        res.status(201).json(newBid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
