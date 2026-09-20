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

const HERO_IMAGE = '/hero.jpg';

const styles = {
    hero: {
        maxWidth: '1280px',
        minHeight: 'calc(100vh - 92px)',
        margin: '0 auto',
        padding: '24px 32px 56px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
        gap: '72px',
        alignItems: 'center'
    },
    heroContent: {
        minWidth: 0,
        padding: '16px 0'
    },
    eyebrow: {
        margin: '0 0 22px',
        color: '#777',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.24em',
        textTransform: 'uppercase'
    },
    title: {
        margin: '0 0 24px',
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(58px, 6vw, 88px)',
        fontWeight: 700,
        lineHeight: 0.92,
        letterSpacing: '-0.045em',
        color: '#1a1a1a'
    },
    titleLine: {
        display: 'block'
    },
    subtitle: {
        maxWidth: '470px',
        margin: '0 0 28px',
        color: '#777',
        fontSize: '17px',
        fontWeight: 300,
        lineHeight: 1.7,
        letterSpacing: '0.01em'
    },
    actions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
    },
    primaryButton: {
        minHeight: '50px',
        padding: '13px 20px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '18px',
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #1a1a1a',
        cursor: 'pointer',
        fontFamily: "'Work Sans', sans-serif",
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '0.03em'
    },
    secondaryButton: {
        minHeight: '50px',
        padding: '13px 20px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        color: '#1a1a1a',
        border: '1px solid #1a1a1a',
        cursor: 'pointer',
        fontFamily: "'Work Sans', sans-serif",
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '0.03em'
    },
    stats: {
        maxWidth: '470px',
        marginTop: '48px',
        paddingTop: '20px',
        borderTop: '1px solid #deded9',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)'
    },
    stat: {
        paddingRight: '16px',
        minWidth: 0
    },
    statNumber: {
        margin: 0,
        fontFamily: "'Playfair Display', serif",
        fontSize: '25px',
        lineHeight: 1,
        color: '#1a1a1a'
    },
    statLabel: {
        margin: '8px 0 0',
        color: '#888',
        fontSize: '9px',
        lineHeight: 1.4,
        letterSpacing: '0.16em',
        textTransform: 'uppercase'
    },
    imageWrap: {
        width: '100%',
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: 'min(72vh, 620px)',
        minHeight: '500px',
        display: 'block',
        objectFit: 'cover',
        objectPosition: 'center',
        backgroundColor: '#e9e9e4'
    },
    imageOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,.34), transparent 38%)',
        pointerEvents: 'none'
    },
    caption: {
        position: 'absolute',
        left: '24px',
        right: '24px',
        bottom: '20px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        color: '#fff'
    },
    captionLabel: {
        margin: 0,
        fontSize: '9px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        opacity: 0.82
    },
    captionTitle: {
        margin: '3px 0 0',
        fontFamily: "'Playfair Display', serif",
        fontSize: '23px',
        fontWeight: 600
    }
};

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

    const scrollToCollection = () => {
        document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    };

    const showClothing = () => {
        setCategory('clothing');
        setTimeout(() => {
            document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

    return (
        <>
            <div className={`loading-screen ${!showLoadingScreen ? 'hidden' : ''}`}>
                <div className="loading-content">
                    <div className="loading-logo">ATELIER</div>
                    <div className="loading-bar"></div>
                </div>
            </div>

            <Navbar
                onOpenCart={() => setCartOpen(true)}
                onOpenAuth={() => setAuthOpen(true)}
            />

            <main className="main-content">
                <section style={styles.hero}>
                    <div style={styles.heroContent}>
                        <p style={styles.eyebrow}>THE NEW SEASON · 2026</p>

                        <h1 style={styles.title}>
                            <span style={styles.titleLine}>Curated</span>
                            <span style={styles.titleLine}>Collections</span>
                        </h1>

                        <p style={styles.subtitle}>
                            Discover timeless pieces crafted with precision,
                            designed for the way you live.
                        </p>

                        <div style={styles.actions}>
                            <button
                                type="button"
                                style={styles.primaryButton}
                                onClick={scrollToCollection}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#d4a574';
                                    e.currentTarget.style.borderColor = '#d4a574';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#1a1a1a';
                                    e.currentTarget.style.borderColor = '#1a1a1a';
                                }}
                            >
                                Explore collection <span>→</span>
                            </button>

                            <button
                                type="button"
                                style={styles.secondaryButton}
                                onClick={showClothing}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#1a1a1a';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#1a1a1a';
                                }}
                            >
                                View clothing
                            </button>
                        </div>

                        <div style={styles.stats}>
                            <div style={styles.stat}>
                                <p style={styles.statNumber}>120+</p>
                                <p style={styles.statLabel}>Curated pieces</p>
                            </div>

                            <div
                                style={{
                                    ...styles.stat,
                                    paddingLeft: '20px',
                                    borderLeft: '1px solid #deded9'
                                }}
                            >
                                <p style={styles.statNumber}>04</p>
                                <p style={styles.statLabel}>Collections</p>
                            </div>

                            <div
                                style={{
                                    ...styles.stat,
                                    paddingLeft: '20px',
                                    borderLeft: '1px solid #deded9'
                                }}
                            >
                                <p style={styles.statNumber}>24/7</p>
                                <p style={styles.statLabel}>Support</p>
                            </div>
                        </div>
                    </div>

                    <div style={styles.imageWrap}>
                        <img
                            src={HERO_IMAGE}
                            alt="ATELIER fashion collection"
                            style={styles.image}
                        />

                        <div style={styles.imageOverlay}></div>

                        <div style={styles.caption}>
                            <div>
                                <p style={styles.captionLabel}>ATELIER</p>
                                <p style={styles.captionTitle}>Essentials</p>
                            </div>
                            <p style={styles.captionLabel}>EST. 2026</p>
                        </div>
                    </div>
                </section>

                <section id="collection" className="filters-section">
                    <div className="filters-container">
                        <div className="filters-header">
                            <div>
                                <p
                                    style={{
                                        margin: '0 0 5px',
                                        color: '#999',
                                        fontSize: '10px',
                                        letterSpacing: '0.22em',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    01 / 04
                                </p>
                                <h2 className="filters-title">Browse Collection</h2>
                            </div>

                            <div className="filters-controls">
                                <select
                                    className="filter-select"
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>
                        </div>

                        <div className="filters-tags">
                            {CATEGORIES.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
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
                        <p
                            style={{
                                textAlign: 'center',
                                padding: '4rem',
                                color: 'var(--color-text-light)'
                            }}
                        >
                            No products found. Please seed the database.
                        </p>
                    )}

                    <div className="products-grid">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                index={index}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>

                    {loading && (
                        <div className="loading-products active">
                            <div className="spinner"></div>
                        </div>
                    )}
                </section>
            </main>

            <CartSidebar
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                onCheckout={startCheckout}
            />

            <AuthModal
                open={authOpen}
                onClose={() => setAuthOpen(false)}
            />

            <CheckoutModal
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
            />
        </>
    );
}
