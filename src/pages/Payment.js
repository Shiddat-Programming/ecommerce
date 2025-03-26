import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentError, setPaymentError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: {
      line1: '',
      city: '',
      postal_code: '',
      country: 'US'
    }
  });

  const [clientSecret, setClientSecret] = useState('');

  // Create PaymentIntent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('http://localhost:5000/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(getCartTotal() * 100), // in cents
            currency: 'usd',
            metadata: {
              userId: user?.id || 'guest',
              cartItems: JSON.stringify(cart.map(item => ({
                id: item.id,
                quantity: item.quantity
              })))
            }
          })
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setPaymentError('Failed to initialize payment. Please try again.');
      }
    };

    if (cart.length > 0) {
      createPaymentIntent();
    }
  }, [cart, getCartTotal, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails
        },
        receipt_email: billingDetails.email
      });

      if (stripeError) {
        setPaymentError(stripeError.message);
        setPaymentProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Save order to database
        const orderResponse = await fetch('http://localhost:5000/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id || null,
            items: cart,
            total: getCartTotal(),
            paymentId: paymentIntent.id,
            shippingAddress: billingDetails.address,
            status: 'completed'
          })
        });

        if (orderResponse.ok) {
          clearCart();
          navigate('/order-confirmation', {
            state: {
              orderData: {
                orderId: paymentIntent.id.slice(-6).toUpperCase(),
                itemsTotal: getCartTotal(),
                shipping: 5.99,
                tax: (getCartTotal() * 0.08).toFixed(2),
                total: (getCartTotal() + 5.99 + (getCartTotal() * 0.08)).toFixed(2),
                shippingAddress: `${billingDetails.address.line1}, ${billingDetails.address.city}, ${billingDetails.address.postal_code}`
              }
            }
          });
        } else {
          throw new Error('Failed to save order');
        }
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setPaymentError('Payment failed. Please try again.');
      setPaymentProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <div className="payment-summary">
        <h2>Order Total: ${getCartTotal().toFixed(2)}</h2>
        <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your order</p>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-section">
          <h3>Billing Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={billingDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={billingDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address.line1"
              value={billingDetails.address.line1}
              onChange={handleInputChange}
              placeholder="Street address"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={billingDetails.address.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="address.postal_code"
                value={billingDetails.address.postal_code}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Payment Method</h3>
          <div className="card-element-container">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {paymentError && <div className="payment-error">{paymentError}</div>}

        <button
          type="submit"
          disabled={!stripe || paymentProcessing || !clientSecret}
          className="pay-button"
        >
          {paymentProcessing ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
        </button>

        <p className="secure-payment-note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#4BB543">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
          Your payment is secure and encrypted
        </p>
      </form>
    </div>
  );
};

export default Payment;