



import React, { createContext, useContext, useState } from 'react'




const CartContext = createContext();
 export const CartProvider = ({children}) => {

   const [cart, setCart] = useState([]);
  //  console.log(cart);
   


  // Add item to cart
    const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
          console.log(existingItem);
          
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

 
   // Remove item from cart
   const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };



   // Calculate total price
   const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };


  return (
    <CartContext.Provider value={{ cart, addToCart  , removeFromCart, getCartTotal}}>
      {children}
    </CartContext.Provider>
  )
}


export const useCart = () => useContext(CartContext);