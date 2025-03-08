
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../context/CartProvider';
 

const Navbar = () => {
  const { cart } = useCart(); // Add this line
  return (
    <nav>

      <Link className='links' to="/">Home</Link>



      <Link to="/cart" className="cart-link"> 
        🛒 Cart
        {cart.length > 0 && (
          <span className="cart-count">{cart.length}</span>
        )}
      </Link>







      <Link className='links' to="/login">Login</Link>
      <Link className='links' to="/register">Register</Link>
    </nav>
  );
};

export default Navbar;