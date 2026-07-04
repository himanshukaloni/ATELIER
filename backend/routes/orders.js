const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { items, shippingInfo, paymentInfo, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ error: `Product ${item.name} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
            }
        }

        const order = new Order({
            userId: req.user.userId,
            userName: user.name,
            userEmail: user.email,
            items: items.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            shippingInfo,
            paymentInfo: {
                cardLast4: paymentInfo.cardNumber.slice(-4),
                cardName: paymentInfo.cardName
            },
            total,
            status: 'pending'
        });

        await order.save();

        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/my-orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email');
        res.json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
