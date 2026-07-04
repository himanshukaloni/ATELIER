const express = require('express');
const Product = require('../models/Product');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { category, sort } = req.query;

        let query = {};
        if (category && category !== 'all') {
            query.category = category;
        }

        let products = await Product.find(query);

        if (sort === 'price-low') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            products.sort((a, b) => b.price - a.price);
        } else if (sort === 'newest') {
            products.sort((a, b) => b.createdAt - a.createdAt);
        }

        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, category, price, description, image, stock } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({ error: 'Name, category, and price are required' });
        }

        const product = new Product({ name, category, price, description, image, stock: stock || 100 });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
