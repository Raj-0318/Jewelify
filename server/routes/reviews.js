const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all reviews (Admin optional or specific logic can be added)
// Or get reviews for a specific product ?productId=...
router.get('/', async (req, res) => {
    try {
        const { productId } = req.query;
        let query = {};
        if (productId) {
            query.product = productId;
        }
        const reviews = await Review.find(query).populate('user', 'name').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a review
router.post('/', auth, async (req, res) => {
    const { productId, rating, comment } = req.body;

    try {
        const newReview = new Review({
            user: req.user.id,
            product: productId,
            rating,
            comment
        });

        const review = await newReview.save();

        // Populate user name for immediate display
        await review.populate('user', 'name');

        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a review (Admin or Owner)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
