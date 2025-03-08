
// src/pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartProvider';
// import { useCart } from '../context/CartContext.js'; 


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
      <img src={product.image} alt={product.title} />
      <h2>{product.title}</h2>
      <p>${product.price}</p>
      <p>{product.description}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductDetails;