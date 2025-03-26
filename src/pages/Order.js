import './oder.css';
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';

const Order = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState({
    items: [],
    subtotal: 0,
    shipping: 5.99,
    tax: 0,
    total: 0
  });

  const [clientSecret, setClientSecret] = useState('');
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize order data
  useEffect(() => {
    const items = location.state?.cartItems || cart;
    const subtotal = location.state?.total || getCartTotal();
    const tax = subtotal * 0.08;
    const total = subtotal + 5.99 + tax;

    setOrderData({
      items,
      subtotal,
      shipping: 5.99,
      tax,
      total
    });
  }, [cart, location.state, getCartTotal]);

  // Create payment intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/create-payment-intent', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify({
            amount: Math.round(orderData.total * 100),
            currency: 'inr'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Payment intent error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderData.total > 0) {
      createPaymentIntent();
    }
  }, [orderData.total]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSuccess = async (paymentId) => {
    try {
      const order = {
        shippingDetails,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        tax: orderData.tax,
        total: orderData.total,
        paymentId,
        status: 'completed',
        date: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save order');
      }

      clearCart();
      navigate('/order-confirmation', {
        state: {
          orderId: paymentId.slice(-6).toUpperCase(),
          orderDetails: order
        }
      });
    } catch (err) {
      console.error('Order submission error:', err);
      throw err; // This will be caught by PaymentForm
    }
  };

  if (orderData.items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-progress">
        <div className="progress-step completed">1. Cart</div>
        <div className="progress-step active">2. Shipping & Payment</div>
        <div className="progress-step">3. Confirmation</div>
      </div>

      <div className="order-container">
        <div className="order-summary">
          <h2>Order Summary</h2>
          {isLoading ? (
            <div className="loading">Loading order details...</div>
          ) : (
            <>
              <div className="order-items">
                {orderData.items.map((item) => (
                  <div key={`${item.id}-${item.size || ''}`} className="order-item">
                    <img src={item.image} alt={item.title} width="80" />
                    <div>
                      <h4>{item.title}</h4>
                      <p>₹{item.price.toFixed(2)} × {item.quantity}</p>
                      {item.size && <p className="size">Size: {item.size}</p>}
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>₹{orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>₹{orderData.shipping.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Tax (8%)</span>
                  <span>₹{orderData.tax.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>₹{orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="shipping-payment-container">
          <div className="shipping-form">
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={shippingDetails.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zip"
                  value={shippingDetails.zip}
                  onChange={handleInputChange}
                  maxLength="6"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  maxLength="10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="payment-section">
            <h2>Payment Method</h2>
            {isLoading ? (
              <div className="payment-loading">Initializing payment...</div>
            ) : clientSecret ? (
              <PaymentForm 
                amount={orderData.total}
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
                shippingDetails={{
                  name: shippingDetails.name,
                  email: shippingDetails.email,
                  address: {
                    line1: shippingDetails.address,
                    city: shippingDetails.city,
                    state: shippingDetails.state,
                    postal_code: shippingDetails.zip,
                    country: 'IN'
                  },
                  phone: shippingDetails.phone
                }}
              />
            ) : (
              <div className="payment-error">
                Failed to initialize payment. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;