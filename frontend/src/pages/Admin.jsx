import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import apiRequest from '../api/client';

const EMPTY_PRODUCT = { name: '', category: '', price: '', stock: 100, image: '', description: '' };

export default function Admin() {
    const { user, token, authLoading, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [section, setSection] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingSection, setLoadingSection] = useState(false);

    const [productModalOpen, setProductModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [productForm, setProductForm] = useState(EMPTY_PRODUCT);

    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Access control
    useEffect(() => {
        if (authLoading) return;
        if (!token) {
            navigate('/');
            return;
        }
        if (user && user.role !== 'admin') {
            showToast('Access denied. Admin only.', 'error');
            navigate('/');
        }
    }, [authLoading, token, user, navigate]);

    const loadStats = async () => {
        try {
            const data = await apiRequest('/admin/stats', {}, token);
            setStats(data);
        } catch {
            showToast('Failed to load stats', 'error');
        }
    };

    const loadProducts = async () => {
        setLoadingSection(true);
        try {
            const data = await apiRequest('/products', {}, token);
            setProducts(data);
        } catch {
            showToast('Failed to load products', 'error');
        } finally {
            setLoadingSection(false);
        }
    };

    const loadOrders = async () => {
        setLoadingSection(true);
        try {
            const data = await apiRequest('/orders', {}, token);
            setOrders(data);
        } catch {
            showToast('Failed to load orders', 'error');
        } finally {
            setLoadingSection(false);
        }
    };

    const loadUsers = async () => {
        setLoadingSection(true);
        try {
            const data = await apiRequest('/admin/users', {}, token);
            setUsers(data);
        } catch {
            showToast('Failed to load users', 'error');
        } finally {
            setLoadingSection(false);
        }
    };

    useEffect(() => {
        if (!token || (user && user.role !== 'admin')) return;
        loadStats();
    }, [token, user]);

    const switchSection = (sec) => {
        setSection(sec);
        if (sec === 'dashboard') loadStats();
        if (sec === 'products') loadProducts();
        if (sec === 'orders') loadOrders();
        if (sec === 'users') loadUsers();
    };

    const openAddProduct = () => {
        setEditingProductId(null);
        setProductForm(EMPTY_PRODUCT);
        setProductModalOpen(true);
    };

    const openEditProduct = async (id) => {
        try {
            const product = await apiRequest(`/products/${id}`, {}, token);
            setEditingProductId(product._id);
            setProductForm({
                name: product.name,
                category: product.category,
                price: product.price,
                stock: product.stock,
                image: product.image || '',
                description: product.description || ''
            });
            setProductModalOpen(true);
        } catch {
            showToast('Failed to load product', 'error');
        }
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                name: productForm.name,
                category: productForm.category,
                price: parseFloat(productForm.price),
                stock: parseInt(productForm.stock) || 100,
                image: productForm.image,
                description: productForm.description
            };

            if (editingProductId) {
                await apiRequest(`/products/${editingProductId}`, { method: 'PUT', body: JSON.stringify(productData) }, token);
                showToast('Product updated successfully', 'success');
            } else {
                await apiRequest('/products', { method: 'POST', body: JSON.stringify(productData) }, token);
                showToast('Product created successfully', 'success');
            }
            setProductModalOpen(false);
            loadProducts();
        } catch (err) {
            showToast(err.message || 'Failed to save product', 'error');
        }
    };

    const deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await apiRequest(`/products/${id}`, { method: 'DELETE' }, token);
            showToast('Product deleted successfully', 'success');
            loadProducts();
        } catch (err) {
            showToast(err.message || 'Failed to delete product', 'error');
        }
    };

    const viewOrderDetails = async (orderId) => {
        try {
            const order = await apiRequest(`/orders/${orderId}`, {}, token);
            setSelectedOrder(order);
            setOrderModalOpen(true);
        } catch {
            showToast('Failed to load order details', 'error');
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!newStatus) return;
        try {
            await apiRequest(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) }, token);
            showToast('Order status updated', 'success');
            loadOrders();
            loadStats();
        } catch (err) {
            showToast(err.message || 'Failed to update order status', 'error');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <div className="sidebar-brand">ATELIER</div>
                <ul className="sidebar-menu">
                    <li><a href="#" className={section === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchSection('dashboard'); }}>Dashboard</a></li>
                    <li><a href="#" className={section === 'products' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchSection('products'); }}>Products</a></li>
                    <li><a href="#" className={section === 'orders' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchSection('orders'); }}>Orders</a></li>
                    <li><a href="#" className={section === 'users' ? 'active' : ''} onClick={(e) => { e.preventDefault(); switchSection('users'); }}>Users</a></li>
                </ul>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </aside>

            <main className="admin-main-content">
                <div className="header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, <span>{user?.name || 'Admin'}</span></p>
                </div>

                {section === 'dashboard' && stats && (
                    <div className="section active">
                        <div className="stats-grid">
                            <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-value">{stats.totalUsers}</div></div>
                            <div className="stat-card"><div className="stat-label">Total Products</div><div className="stat-value">{stats.totalProducts}</div></div>
                            <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-value">{stats.totalOrders}</div></div>
                            <div className="stat-card"><div className="stat-label">Total Revenue</div><div className="stat-value">${stats.totalRevenue.toFixed(2)}</div></div>
                        </div>

                        <div style={{ background: 'var(--color-white)', padding: '2rem', border: '1px solid var(--color-border)' }}>
                            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Orders by Status</h3>
                            <div className="stats-grid">
                                <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-value">{stats.ordersByStatus.pending}</div></div>
                                <div className="stat-card"><div className="stat-label">Processing</div><div className="stat-value">{stats.ordersByStatus.processing}</div></div>
                                <div className="stat-card"><div className="stat-label">Shipped</div><div className="stat-value">{stats.ordersByStatus.shipped}</div></div>
                                <div className="stat-card"><div className="stat-label">Delivered</div><div className="stat-value">{stats.ordersByStatus.delivered}</div></div>
                            </div>
                        </div>
                    </div>
                )}

                {section === 'products' && (
                    <div className="section active">
                        <div className="section-header">
                            <h2 className="section-title">Products</h2>
                            <button className="btn" onClick={openAddProduct}>Add Product</button>
                        </div>
                        {loadingSection && <div className="loading active"><div className="spinner"></div></div>}
                        {!loadingSection && (
                            <div className="table-container">
                                {products.length === 0 ? (
                                    <p style={{ padding: '2rem', textAlign: 'center' }}>No products found</p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product._id}>
                                                    <td><img src={product.image} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover' }} /></td>
                                                    <td>{product.name}</td>
                                                    <td>{product.category}</td>
                                                    <td>${product.price.toFixed(2)}</td>
                                                    <td>{product.stock}</td>
                                                    <td>
                                                        <button className="btn btn-sm" onClick={() => openEditProduct(product._id)}>Edit</button>{' '}
                                                        <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(product._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {section === 'orders' && (
                    <div className="section active">
                        <div className="section-header"><h2 className="section-title">All Orders</h2></div>
                        {loadingSection && <div className="loading active"><div className="spinner"></div></div>}
                        {!loadingSection && (
                            <div className="table-container">
                                {orders.length === 0 ? (
                                    <p style={{ padding: '2rem', textAlign: 'center' }}>No orders found</p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr><th>Order ID</th><th>Customer</th><th>Email</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td>{order._id.slice(-8)}</td>
                                                    <td>{order.userName}</td>
                                                    <td>{order.userEmail}</td>
                                                    <td>{order.items.length}</td>
                                                    <td>${order.total.toFixed(2)}</td>
                                                    <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <button className="btn btn-sm" onClick={() => viewOrderDetails(order._id)}>View</button>{' '}
                                                        <select className="btn btn-sm" defaultValue="" onChange={(e) => { updateOrderStatus(order._id, e.target.value); e.target.value = ''; }}>
                                                            <option value="">Change Status</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {section === 'users' && (
                    <div className="section active">
                        <div className="section-header"><h2 className="section-title">Users</h2></div>
                        {loadingSection && <div className="loading active"><div className="spinner"></div></div>}
                        {!loadingSection && (
                            <div className="table-container">
                                {users.length === 0 ? (
                                    <p style={{ padding: '2rem', textAlign: 'center' }}>No users found</p>
                                ) : (
                                    <table>
                                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u._id}>
                                                    <td>{u.name}</td>
                                                    <td>{u.email}</td>
                                                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Product Modal */}
            <div className={`admin-modal ${productModalOpen ? 'active' : ''}`}>
                <div className="admin-modal-content">
                    <div className="admin-modal-header">
                        <h3>{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
                        <button className="modal-close" onClick={() => setProductModalOpen(false)}>&times;</button>
                    </div>
                    <form onSubmit={saveProduct}>
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category *</label>
                                <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required>
                                    <option value="">Select Category</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="shoes">Shoes</option>
                                    <option value="bags">Bags</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price *</label>
                                <input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Stock</label>
                                <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input type="url" value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })}></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn">Save Product</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setProductModalOpen(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Order Details Modal */}
            <div className={`admin-modal ${orderModalOpen ? 'active' : ''}`}>
                <div className="admin-modal-content">
                    <div className="admin-modal-header">
                        <h3>Order Details</h3>
                        <button className="modal-close" onClick={() => setOrderModalOpen(false)}>&times;</button>
                    </div>
                    {selectedOrder && (
                        <div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4>Order ID: {selectedOrder._id}</h4>
                                <p><strong>Status:</strong> <span className={`badge badge-${selectedOrder.status}`}>{selectedOrder.status}</span></p>
                                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4>Customer Information</h4>
                                <p><strong>Name:</strong> {selectedOrder.userName}</p>
                                <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4>Shipping Address</h4>
                                <p>{selectedOrder.shippingInfo.firstName} {selectedOrder.shippingInfo.lastName}</p>
                                <p>{selectedOrder.shippingInfo.address}</p>
                                <p>{selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.zip}</p>
                                <p>{selectedOrder.shippingInfo.country}</p>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4>Payment Information</h4>
                                <p><strong>Card:</strong> **** **** **** {selectedOrder.paymentInfo.cardLast4}</p>
                                <p><strong>Cardholder:</strong> {selectedOrder.paymentInfo.cardName}</p>
                            </div>
                            <div>
                                <h4>Items</h4>
                                <div className="order-items">
                                    {selectedOrder.items.map((item, i) => (
                                        <div className="order-item" key={i}>
                                            <img src={item.image} alt={item.name} />
                                            <div>
                                                <p><strong>{item.name}</strong></p>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Price: ${item.price.toFixed(2)}</p>
                                                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--color-border)' }}>
                                <h3>Total: ${selectedOrder.total.toFixed(2)}</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
