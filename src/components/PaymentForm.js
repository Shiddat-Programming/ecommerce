import React, { useState } from 'react';
import './paymentform.css'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const PaymentForm = ({ amount, clientSecret, onSuccess, shippingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Initialize billing details safely
  const [billingDetails, setBillingDetails] = useState({
    name: shippingDetails?.name || '',
    email: shippingDetails?.email || '',
    address: {
      line1: shippingDetails?.address?.line1 || '',
      city: shippingDetails?.address?.city || '',
      state: shippingDetails?.address?.state || '',
      postal_code: shippingDetails?.address?.postal_code || '',
      country: shippingDetails?.address?.country || 'IN'
    },
    phone: shippingDetails?.phone || ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || completed) {
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      // Validate billing details first
      if (!billingDetails.name || !billingDetails.email) {
        throw new Error('Please fill in all required billing information');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: billingDetails
          },
          receipt_email: billingDetails.email
        }
      );

      if (error) {
        throw error;
      }

      if (paymentIntent.status === 'succeeded') {
        setCompleted(true);
        await onSuccess(paymentIntent.id);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err.message || 'Payment failed. Please try again.');
    } finally {
      if (!completed) {
        setProcessing(false);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
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
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-section">
        <h3>Billing Information</h3>
        <input
          type="text"
          name="name"
          value={billingDetails.name}
          onChange={handleInputChange}
          placeholder="Full Name *"
          required
          disabled={processing}
        />
        <input
          type="email"
          name="email"
          value={billingDetails.email}
          onChange={handleInputChange}
          placeholder="Email *"
          required
          disabled={processing}
        />
        <input
          type="tel"
          name="phone"
          value={billingDetails.phone}
          onChange={handleInputChange}
          placeholder="Phone *"
          required
          disabled={processing}
        />
      </div>

      <div className="form-section">
        <h3>Payment Method</h3>
        <div className="card-element-container">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {paymentError && (
        <div className="payment-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#f44336">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {paymentError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing || completed}
        className={`pay-button ${processing ? 'processing' : ''}`}
      >
        {processing ? (
          <>
            <span className="spinner"></span>
            Processing...
          </>
        ) : (
          `Pay ₹${amount.toFixed(2)}`
        )}
      </button>
    </form>
  );
};

export default PaymentForm;