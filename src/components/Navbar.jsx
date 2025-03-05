
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
  return (
    <nav>

      <Link className='links' to="/">Home</Link>
      <Link className='links' to="/cart">Cart</Link>
      <Link className='links' to="/login">Login</Link>
      <Link className='links' to="/register">Register</Link>
    </nav>
  );
};

export default Navbar;