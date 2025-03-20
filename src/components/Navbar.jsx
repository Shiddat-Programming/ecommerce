// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'

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
      <Link className='links_color'  to="/">Home</Link>
      <Link   to="/cart" className="cart-link links_color">
        🛒 Cart
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </Link>
      {user ? ( // Show logout button if user is logged in
        <button onClick={handleLogout}>Logout</button>
      ) : ( // Show login and register buttons if user is not logged in
        <>
          <Link className='links_color' to="/login">Login</Link>
          <Link  className='links_color' to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;