import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartProvider';

const OrderConfirmation = () => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const location = useLocation();
  const orderData = location.state?.orderData || {};

  // Clear cart when component mounts
  React.useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4BB543"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h1>Order Confirmed!</h1>
          <p className="confirmation-id">Order #: {orderData.orderId || '123456'}</p>
        </div>

        <div className="confirmation-details">
          <h2>Thank you, {user?.name || 'Customer'}!</h2>
          <p>Your order has been placed successfully.</p>
          
          <div className="summary-section">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items:</span>
              <span>${orderData.itemsTotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${orderData.shipping?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${orderData.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${orderData.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="delivery-info">
            <h3>Estimated Delivery</h3>
            <p>{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p>Shipping to: {orderData.shippingAddress || 'Your address'}</p>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/orders" className="btn btn-primary">
            View Order Details
          </Link>
          <Link to="/" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>

        <div className="confirmation-footer">
          <p>We've sent a confirmation email to {user?.email || 'your email'}.</p>
          <p>Need help? <Link to="/contact">Contact us</Link></p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;