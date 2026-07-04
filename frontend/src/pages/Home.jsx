import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import AuthModal from '../components/AuthModal';
import CheckoutModal from '../components/CheckoutModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import apiRequest from '../api/client';

const CATEGORIES = [
    { value: 'all', label: 'All' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'bags', label: 'Bags' }
];

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [sort, setSort] = useState('featured');
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);

    const [cartOpen, setCartOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const { user } = useAuth();
    const { cart, addToCart } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        const timer = setTimeout(() => setShowLoadingScreen(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function loadProducts() {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    category: category !== 'all' ? category : '',
                    sort
                });
                const data = await apiRequest(`/products?${params}`);
                if (!cancelled) setProducts(data);
            } catch (error) {
                console.error('Failed to load products:', error);
                if (!cancelled) showToast('Failed to load products');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadProducts();
        return () => { cancelled = true; };
    }, [category, sort]);

    const startCheckout = () => {
        if (!user) {
            setAuthOpen(true);
            showToast('Please sign in to checkout');
            return;
        }
        if (cart.length === 0) {
            showToast('Your cart is empty');
            return;
        }
        setCartOpen(false);
        setCheckoutOpen(true);
    };

    return (
        <>
            <div className={`loading-screen ${!showLoadingScreen ? 'hidden' : ''}`}>
                <div className="loading-content">
                    <div className="loading-logo">ATELIER</div>
                    <div className="loading-bar"></div>
                </div>
            </div>

            <Navbar onOpenCart={() => setCartOpen(true)} onOpenAuth={() => setAuthOpen(true)} />

            <main className="main-content">
                <section className="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            <span className="hero-title-line">Curated</span>
                            <span className="hero-title-line">Collections</span>
                        </h1>
                        <p className="hero-subtitle">Discover timeless pieces crafted with precision</p>
                    </div>
                    <div className="hero-image">
                        <div className="hero-image-placeholder"></div>
                    </div>
                </section>

                <section className="filters-section">
                    <div className="filters-container">
                        <div className="filters-header">
                            <h2 className="filters-title">Browse Collection</h2>
                            <div className="filters-controls">
                                <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>
                        </div>
                        <div className="filters-tags">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.value}
                                    className={`filter-tag ${category === c.value ? 'active' : ''}`}
                                    onClick={() => setCategory(c.value)}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="products-section">
                    {!loading && products.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-light)' }}>
                            No products found. Please seed the database.
                        </p>
                    )}
                    <div className="products-grid">
                        {products.map((product, index) => (
                            <ProductCard key={product._id} product={product} index={index} onAddToCart={addToCart} />
                        ))}
                    </div>
                    {loading && (
                        <div className="loading-products active">
                            <div className="spinner"></div>
                        </div>
                    )}
                </section>
            </main>

            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={startCheckout} />
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
            <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
        </>
    );
}
