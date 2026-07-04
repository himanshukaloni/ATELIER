import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import apiRequest from '../api/client';

const COUNTRIES = [
    { value: '', label: 'Select Country' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'IN', label: 'India' }
];

function formatCardNumber(value) {
    const digits = value.replace(/\s/g, '');
    const groups = digits.match(/.{1,4}/g);
    return (groups ? groups.join(' ') : digits).substring(0, 19);
}

function formatExpiry(value) {
    let digits = value.replace(/\//g, '');
    if (digits.length >= 2) {
        digits = digits.substring(0, 2) + '/' + digits.substring(2, 4);
    }
    return digits;
}

export default function CheckoutModal({ open, onClose }) {
    const { cart, totalPrice, clearCart } = useCart();
    const { token } = useAuth();
    const { showToast } = useToast();

    const [step, setStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '', lastName: '', address: '', city: '', zip: '', country: ''
    });
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '', cardExpiry: '', cardCVC: '', cardName: ''
    });

    const handleClose = () => {
        onClose();
        setStep(1);
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setStep(3);
    };

    const placeOrder = async () => {
        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                shippingInfo,
                paymentInfo,
                total: totalPrice
            };

            await apiRequest('/orders', { method: 'POST', body: JSON.stringify(orderData) }, token);

            clearCart();
            setStep(4);
            showToast('Order placed successfully!');
        } catch (error) {
            showToast(error.message || 'Order failed');
        }
    };

    return (
        <div className={`modal ${open ? 'active' : ''}`}>
            <div className="modal-overlay" onClick={handleClose}></div>
            <div className="modal-content checkout-content">
                <button className="modal-close" onClick={handleClose}>&times;</button>

                <div className="checkout-container">
                    <h2 className="checkout-title">Checkout</h2>

                    <div className="checkout-steps">
                        <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
                            <div className="step-number">1</div>
                            <div className="step-label">Shipping</div>
                        </div>
                        <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
                            <div className="step-number">2</div>
                            <div className="step-label">Payment</div>
                        </div>
                        <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
                            <div className="step-number">3</div>
                            <div className="step-label">Review</div>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="checkout-form-step active">
                            <h3 className="checkout-subtitle">Shipping Information</h3>
                            <form onSubmit={handleShippingSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input type="text" value={shippingInfo.firstName}
                                            onChange={e => setShippingInfo({ ...shippingInfo, firstName: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input type="text" value={shippingInfo.lastName}
                                            onChange={e => setShippingInfo({ ...shippingInfo, lastName: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input type="text" value={shippingInfo.address}
                                        onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input type="text" value={shippingInfo.city}
                                            onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>ZIP Code</label>
                                        <input type="text" value={shippingInfo.zip}
                                            onChange={e => setShippingInfo({ ...shippingInfo, zip: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <select value={shippingInfo.country}
                                        onChange={e => setShippingInfo({ ...shippingInfo, country: e.target.value })} required>
                                        {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="checkout-next-btn">Continue to Payment</button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="checkout-form-step active">
                            <h3 className="checkout-subtitle">Payment Information</h3>
                            <form onSubmit={handlePaymentSubmit}>
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                                        value={paymentInfo.cardNumber}
                                        onChange={e => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                                        required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" maxLength={5}
                                            value={paymentInfo.cardExpiry}
                                            onChange={e => setPaymentInfo({ ...paymentInfo, cardExpiry: formatExpiry(e.target.value) })}
                                            required />
                                    </div>
                                    <div className="form-group">
                                        <label>CVC</label>
                                        <input type="text" placeholder="123" maxLength={3}
                                            value={paymentInfo.cardCVC}
                                            onChange={e => setPaymentInfo({ ...paymentInfo, cardCVC: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                                            required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Cardholder Name</label>
                                    <input type="text" value={paymentInfo.cardName}
                                        onChange={e => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })} required />
                                </div>
                                <div className="checkout-buttons">
                                    <button type="button" className="checkout-back-btn" onClick={() => setStep(1)}>Back</button>
                                    <button type="submit" className="checkout-next-btn">Review Order</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="checkout-form-step active">
                            <h3 className="checkout-subtitle">Review Your Order</h3>
                            <div className="review-section">
                                <h4>Shipping Address</h4>
                                <div>
                                    <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                                    <p>{shippingInfo.address}</p>
                                    <p>{shippingInfo.city}, {shippingInfo.zip}</p>
                                    <p>{shippingInfo.country}</p>
                                </div>
                            </div>
                            <div className="review-section">
                                <h4>Payment Method</h4>
                                <div>
                                    <p>Card ending in {paymentInfo.cardNumber.replace(/\s/g, '').slice(-4)}</p>
                                    <p>{paymentInfo.cardName}</p>
                                </div>
                            </div>
                            <div className="review-section">
                                <h4>Order Summary</h4>
                                <div>
                                    {cart.map(item => (
                                        <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span>{item.name} × {item.quantity}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="review-total">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="checkout-buttons">
                                <button type="button" className="checkout-back-btn" onClick={() => setStep(2)}>Back</button>
                                <button type="button" className="checkout-next-btn" onClick={placeOrder}>Place Order</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="checkout-form-step active">
                            <div className="success-icon">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h3 className="success-title">Order Placed Successfully!</h3>
                            <p className="success-message">Thank you for your purchase. You can track your order in your dashboard.</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <Link to="/dashboard" className="checkout-next-btn" style={{ textDecoration: 'none' }} onClick={handleClose}>View Orders</Link>
                                <button className="checkout-next-btn" onClick={handleClose}>Continue Shopping</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
