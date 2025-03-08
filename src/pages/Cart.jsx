import React from 'react'
import { useCart } from '../context/CartProvider';

const Cart = () => {

    const { cart , removeFromCart , getCartTotal} = useCart();
  return (
   

    <div>

      <h1> Your Cart </h1>

        
   {  cart.length === 0 ? (

<p> your cart is Empty </p>



   )  : (

    <div>
    <h1>Cart</h1>
    <div className="product-grid">
        {cart.map((product) => (
        <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <button onClick={() => removeFromCart(product.id)}>Remove</button>
        </div>
        ))}
    </div>
  
    <h2>Total: ${getCartTotal().toFixed(2)}</h2>
  </div>
   

   ) }






         
    </div>
  )
}

export default Cart