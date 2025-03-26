// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import App from './App';
import { CartProvider } from './context/CartProvider';
import { AuthProvider } from './context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51R6lTR2UTzqr91lTr6NpVc7I7cKm56x9sIS0rED552dLaZJ9t523XG6jlOQFkbsHpkVEKm0c14UlMwH2eDzrPQSO00AIkAVs4F');

// Get the root element
const container = document.getElementById('root');
const root = createRoot(container); // Create a root

// Render your app
root.render(
  <AuthProvider>
    <CartProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </CartProvider>
  </AuthProvider>
);