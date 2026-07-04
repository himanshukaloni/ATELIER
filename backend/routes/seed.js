const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

const products = [
    { name: 'Classic Linen Shirt', category: 'clothing', price: 89.99, description: 'Premium Italian linen shirt with mother-of-pearl buttons', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop', stock: 50 },
    { name: 'Leather Crossbody Bag', category: 'bags', price: 249.99, description: 'Handcrafted full-grain leather crossbody bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', stock: 30 },
    { name: 'Minimalist Watch', category: 'accessories', price: 179.99, description: 'Swiss movement automatic watch with sapphire crystal', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', stock: 40 },
    { name: 'Suede Chelsea Boots', category: 'shoes', price: 199.99, description: 'Premium Italian suede Chelsea boots with leather sole', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop', stock: 25 },
    { name: 'Cashmere Sweater', category: 'clothing', price: 159.99, description: 'Ultra-soft 100% cashmere crew neck sweater', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', stock: 45 },
    { name: 'Silk Scarf', category: 'accessories', price: 69.99, description: 'Hand-printed pure silk scarf with gift box', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop', stock: 60 },
    { name: 'Canvas Tote Bag', category: 'bags', price: 49.99, description: 'Durable organic canvas tote with leather handles', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop', stock: 80 },
    { name: 'Leather Loafers', category: 'shoes', price: 149.99, description: 'Classic penny loafers in premium calf leather', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=400&fit=crop', stock: 35 },
    { name: 'Wool Blazer', category: 'clothing', price: 299.99, description: 'Tailored Italian wool blazer with peak lapels', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop', stock: 20 },
    { name: 'Leather Belt', category: 'accessories', price: 79.99, description: 'Full-grain leather belt with brass buckle', image: 'https://images.unsplash.com/photo-1624222247344-3f9dc95a8be6?w=400&h=400&fit=crop', stock: 70 },
    { name: 'Designer Sneakers', category: 'shoes', price: 189.99, description: 'Premium leather low-top sneakers', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', stock: 45 },
    { name: 'Leather Briefcase', category: 'bags', price: 399.99, description: 'Professional leather briefcase with laptop compartment', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', stock: 15 }
];

router.post('/', async (req, res) => {
    try {
        const adminExists = await User.findOne({ email: 'admin@atelier.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Admin',
                email: 'admin@atelier.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created: admin@atelier.com / admin123');
        }

        await Product.deleteMany({});
        await Product.insertMany(products);

        res.json({
            message: 'Database seeded successfully',
            productsCreated: products.length,
            adminCredentials: { email: 'admin@atelier.com', password: 'admin123' }
        });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: 'Seed failed', details: error.message });
    }
});

module.exports = router;
