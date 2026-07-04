const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const processingOrders = await Order.countDocuments({ status: 'processing' });
        const shippedOrders = await Order.countDocuments({ status: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            ordersByStatus: {
                pending: pendingOrders,
                processing: processingOrders,
                shipped: shippedOrders,
                delivered: deliveredOrders
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
