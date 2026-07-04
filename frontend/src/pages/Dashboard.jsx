import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import apiRequest from '../api/client';

const STATUS_MESSAGES = {
    pending: { icon: '⏳', text: 'Order is being processed', color: 'var(--warning, #e67e22)' },
    processing: { icon: '📦', text: 'Preparing your order', color: '#3498db' },
    shipped: { icon: '🚚', text: 'On the way to you', color: '#9b59b6' },
    delivered: { icon: '✓', text: 'Delivered', color: 'var(--color-success)' },
    cancelled: { icon: '✗', text: 'Order cancelled', color: 'var(--color-error)' }
};

export default function Dashboard() {
    const { user, token, authLoading, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!authLoading && !token) {
            navigate('/');
        }
    }, [authLoading, token, navigate]);

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        async function loadOrders() {
            setLoading(true);
            setError(false);
            try {
                const data = await apiRequest('/orders/my-orders', {}, token);
                if (!cancelled) setOrders(data);
            } catch (err) {
                if (!cancelled) {
                    showToast('Failed to load orders', 'error');
                    setError(true);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadOrders();
        return () => { cancelled = true; };
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div>
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-brand">ATELIER</div>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Shop</Link>
                        <Link to="/dashboard" className="nav-link active">My Orders</Link>
                        <span className="nav-link">{user ? user.name : 'Loading...'}</span>
                        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="container">
                <div className="header">
                    <h1>My Orders</h1>
                    <p>Track and manage your orders</p>
                </div>

                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p style={{ marginTop: '1rem', color: 'var(--color-text-light)' }}>Loading your orders...</p>
                    </div>
                )}

                {!loading && error && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>
                        <p>Failed to load orders. Please try again later.</p>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="empty-state">
                        <h2>No Orders Yet</h2>
                        <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
                        <Link to="/" className="btn">Start Shopping</Link>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="orders-grid">
                        {orders.map(order => {
                            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            });
                            const statusInfo = STATUS_MESSAGES[order.status];
                            return (
                                <div className="order-card" key={order._id}>
                                    <div className="order-header">
                                        <div>
                                            <div className="order-id">Order #{order._id.slice(-8)}</div>
                                            <div className="order-date">{orderDate}</div>
                                        </div>
                                        <span className={`badge badge-${order.status}`}>{order.status}</span>
                                    </div>

                                    <div className="order-items">
                                        {order.items.map((item, i) => (
                                            <div className="order-item" key={i}>
                                                <img src={item.image} alt={item.name} className="item-image" />
                                                <div className="item-details">
                                                    <div className="item-name">{item.name}</div>
                                                    <div className="item-info">
                                                        Quantity: {item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="shipping-info">
                                        <strong>Shipping to:</strong><br />
                                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br />
                                        {order.shippingInfo.address}<br />
                                        {order.shippingInfo.city}, {order.shippingInfo.zip}<br />
                                        {order.shippingInfo.country}
                                    </div>

                                    <div className="order-footer">
                                        <div className="order-total">Total: ${order.total.toFixed(2)}</div>
                                        {statusInfo && (
                                            <span style={{ color: statusInfo.color }}>{statusInfo.icon} {statusInfo.text}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
