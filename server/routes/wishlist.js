const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// Get user's wishlist
router.get('/:userId', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate('products.productId');
        if (!wishlist) {
            return res.json({ products: [] });
        }
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add to wishlist
router.post('/add', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [] });
        }

        // Check if product already exists
        const exists = wishlist.products.find(p => p.productId.toString() === productId);
        if (exists) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        wishlist.products.push({ productId });
        await wishlist.save();
        res.status(201).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove from wishlist
router.delete('/remove/:userId/:productId', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.params.userId });
        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

        wishlist.products = wishlist.products.filter(p => p.productId.toString() !== req.params.productId);
        await wishlist.save();
        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
