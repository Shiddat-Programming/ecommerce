import './oder.css'

import React, { useState } from 'react';
import { useCart } from '../context/CartProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';

const Order = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get cart data either from context or location state
  const orderItems = location.state?.cartItems || cart;
  const orderTotal = location.state?.total || getCartTotal();

  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({ ...shippingDetails, [name]: value });
  };

  const handlePaymentSuccess = (paymentId) => {
    const order = {
      shippingDetails,
      items: orderItems,
      total: orderTotal,
      paymentId,
      status: 'processing'
    };

    // Save order to backend
    saveOrder(order).then(() => {
      clearCart(); // This will now work
      navigate('/order-confirmation', {
        state: {
          orderData: {
            orderId: paymentId.slice(-6).toUpperCase(),
            items: orderItems,
            total: orderTotal,
            shippingDetails
          }
        }
      });
    });
  };

  const saveOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return response.json();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <div className="order-page">
      <div className="order-progress">
        <div className="progress-step active">1. Cart</div>
        <div className="progress-step active">2. Shipping</div>
        <div className="progress-step">3. Payment</div>
        <div className="progress-step">4. Confirmation</div>
      </div>

      <div className="order-container">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {orderItems.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.title} width="80" />
                <div>
                  <h4>{item.title}</h4>
                  <p>${item.price} × {item.quantity}</p>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>$5.99</span>
            </div>
            <div className="total-row">
              <span>Tax</span>
              <span>${(orderTotal * 0.08).toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${(orderTotal + 5.99 + (orderTotal * 0.08)).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="shipping-payment-container">
          <div className="shipping-form">
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={shippingDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={shippingDetails.zip}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={shippingDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="payment-section">
            <h2>Payment Method</h2>
            <PaymentForm 
              total={orderTotal + 5.99 + (orderTotal * 0.08)} 
              onSuccess={handlePaymentSuccess} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;