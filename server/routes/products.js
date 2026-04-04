const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        console.log('Backend: Fetching product URL param:', req.params.id);
        const product = await Product.findById(req.params.id);
        console.log('Backend: Found product:', product ? product.name : 'Not Found');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ message: 'Product not found' });
        res.status(500).send('Server error');
    }
});

// Create Product (Admin only)
router.post('/', [auth, admin], async (req, res) => {
    const { name, description, price, category, image, stock } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Product (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
    const { name, description, price, category, image, stock } = req.body;
    console.log('Backend: Updating product:', req.params.id, req.body);

    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (price) productFields.price = price;
    if (category) productFields.category = category;
    if (image) productFields.image = image;
    if (stock !== undefined) productFields.stock = stock;

    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            console.log('Backend: Product not found for update');
            return res.status(404).json({ message: 'Product not found' });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );
        console.log('Backend: Product updated:', product);
        res.json(product);
    } catch (err) {
        console.error('Backend: Update error:', err.message);
        res.status(500).send('Server error');
    }
});

// Delete Product (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
