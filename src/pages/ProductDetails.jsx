
// src/pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartProvider';
// import { useCart } from '../context/CartContext.js'; 
import './product_details.css'
import "./Home.css"



const ProductDetails = () => {
  const { productId } = useParams(); // Get productId from URL
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart(); // Add this line

  useEffect(() => {
    const getProduct = async () => {
      const data = await fetchProductById(productId);
      setProduct(data);
    };
    getProduct();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details">
      <img width="200px" src={product.image} alt={product.title} />
      <h2>{product.title}</h2>
      <p className='price'>${product.price}</p>
      <p>{product.description}</p>
      <button  className='add_to_cart' onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;