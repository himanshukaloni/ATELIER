import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenCart, onOpenAuth }) {
    const { user } = useAuth();
    const { totalItems } = useCart();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">ATELIER</div>
                <div className="nav-links">
                    <Link to="/" className="nav-link active">Shop</Link>
                    {user && <Link to="/dashboard" className="nav-link">My Orders</Link>}
                    {user?.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
                </div>
                <div className="nav-actions">
                    <button className="nav-icon" id="userBtn" onClick={onOpenAuth} aria-label="Account">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                    <button className="nav-icon cart-btn" onClick={onOpenCart} aria-label="Cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span className="cart-count">{totalItems}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
