const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get Dashboard Stats
router.get('/stats', [auth, admin], async (req, res) => {
    try {
        // 1. Total Sales
        const salesResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;

        // 2. Active Orders
        const activeOrders = await Order.countDocuments({ status: { $ne: 'Delivered' } });

        // 3. Total Products
        const totalProducts = await Product.countDocuments();

        // 4. Total Users
        const totalUsers = await User.countDocuments();

        // 5. Recent Orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email');

        // 6. Recent Reviews
        const recentReviews = await Review.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name')
            .populate('product', 'name');

        res.json({
            totalSales,
            activeOrders,
            totalProducts,
            totalUsers,
            recentOrders,
            recentReviews
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
