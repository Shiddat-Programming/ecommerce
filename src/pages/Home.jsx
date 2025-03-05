
// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  console.log(products);
  
 
  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
   
      
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
<Link to={`/product/${product.id}`}> {/* Add this line */}
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            </Link> {/* Add this line */}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;