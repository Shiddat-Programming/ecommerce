
// src/pages/ProductDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../services/api';

const ProductDetails = () => {
  const { productId } = useParams(); // Get productId from URL
  const [product, setProduct] = useState(null);

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
      <button>Add to Cart</button> {/* We'll implement this later */}
    </div>
  );
};

export default ProductDetails;