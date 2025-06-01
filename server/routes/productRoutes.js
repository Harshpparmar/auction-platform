const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Get active product
router.get('/active', async (req, res) => {
    try {
        // check if there is an active product
        const product = await Product.findOne({ is_active: true });

        if (!product) {
            return res.status(404).json({ message: 'No active product found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new product (admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, image_url, starting_bid } = req.body;

        // validation
        if (!title || !description || !starting_bid) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if starting_bid is a valid number
        const newProduct = new Product({
            title,
            description,
            image_url: image_url || 'https://images.pexels.com/photos/8534233/pexels-photo-8534233.jpeg?auto=compress&cs=tinysrgb&w=600',
            starting_bid: Number(starting_bid)
        });

        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Set a product as active (admin only)
router.post('/:id/set-active', authMiddleware, async (req, res) => {

    // Validate product ID
    const { id } = req.params;
    try {
        // Set all products to inactive
        await Product.updateMany({}, { is_active: false });

        // Set selected product to active
        const updated = await Product.findByIdAndUpdate(id, { is_active: true }, { new: true });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to set active product' });
    }
});


// get all products admin only
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Fetch all products sorted by creation date
        const products = await Product.find().sort({ created_at: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;