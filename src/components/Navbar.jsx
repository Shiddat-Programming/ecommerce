// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout function
    navigate('/'); // Redirect to home page
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/cart" className="cart-link">
        🛒 Cart
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </Link>
      {user ? ( // Show logout button if user is logged in
        <button onClick={handleLogout}>Logout</button>
      ) : ( // Show login and register buttons if user is not logged in
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;