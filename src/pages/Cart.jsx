import React from 'react';
import { useCart } from '../context/CartProvider';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    navigate('/order', { 
      state: { 
        cartItems: [...cart], // Create a new array to avoid reference issues
        total: getCartTotal(),
        itemCount: cart.reduce((total, item) => total + item.quantity, 0)
      }
    });
  };

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="btn">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size || ''}`} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>₹{item.price.toFixed(2)} x {item.quantity}</p>
                  {item.size && <p>Size: {item.size}</p>}
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Total: ₹{getCartTotal().toFixed(2)}</h2>
            <button 
              onClick={handleCheckout} 
              className="checkout-btn"
              disabled={cart.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;