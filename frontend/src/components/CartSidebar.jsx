import { useCart } from '../context/CartContext';

export default function CartSidebar({ open, onClose, onCheckout }) {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

    return (
        <div className={`cart-sidebar ${open ? 'active' : ''}`}>
            <div className="cart-overlay" onClick={onClose}></div>
            <div className="cart-panel">
                <div className="cart-header">
                    <h3 className="cart-title">Shopping Cart</h3>
                    <button className="cart-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="cart-items">
                    {cart.map(item => (
                        <div className="cart-item" key={item._id}>
                            <div className="cart-item-image">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="cart-item-details">
                                <div className="cart-item-name">{item.name}</div>
                                <div className="cart-item-category">{item.category}</div>
                                <div className="cart-item-price">${item.price.toFixed(2)}</div>
                                <div className="cart-item-actions">
                                    <div className="quantity-control">
                                        <button className="quantity-btn" onClick={() => updateQuantity(item._id, -1)}>-</button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button className="quantity-btn" onClick={() => updateQuantity(item._id, 1)}>+</button>
                                    </div>
                                    <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {cart.length === 0 && (
                    <div className="cart-empty active">
                        <p>Your cart is empty</p>
                    </div>
                )}

                <div className="cart-footer">
                    <div className="cart-total">
                        <span>Subtotal</span>
                        <span className="cart-total-amount">${totalPrice.toFixed(2)}</span>
                    </div>
                    <button className="cart-checkout-btn" onClick={onCheckout}>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
}
