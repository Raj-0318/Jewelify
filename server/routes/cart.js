const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get Cart
router.get('/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId }).populate('products.productId');
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, products: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add to Cart
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const itemIndex = cart.products.findIndex(p => p.productId && p.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.products[itemIndex].quantity += quantity || 1;
        } else {
            cart.products.push({ productId, quantity: quantity || 1 });
        }
        await cart.save();
        cart = await Cart.findOne({ userId }).populate('products.productId');
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Cart Item Quantity
router.put('/update', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.products.findIndex(p => p.productId && p.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.products[itemIndex].quantity = quantity;
            await cart.save();
            cart = await Cart.findOne({ userId }).populate('products.productId');
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Remove from Cart
router.delete('/remove/:userId/:productId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.products = cart.products.filter(p => p.productId && p.productId.toString() !== req.params.productId);
        await cart.save();
        cart = await Cart.findOne({ userId: req.params.userId }).populate('products.productId');
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Clear Cart
router.delete('/clear/:userId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.products = [];
        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
