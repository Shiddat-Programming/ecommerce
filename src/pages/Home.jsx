// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import { Link } from 'react-router-dom';

import './Home.css'

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch products from API
  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      
      
    };
    getProducts();
  }, []);

  // Filter products based on search text, price range, and category
  const filteredProducts = products.filter((product) => {

    const matchesSearch = product.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesPrice =
      (minPrice === '' || product.price >= parseFloat(minPrice)) &&
      (maxPrice === '' || product.price <= parseFloat(maxPrice));
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesPrice && matchesCategory;
    
  });

  
  // Get unique categories for dropdown
  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div className="home">
      <h1>Products</h1>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-bar"
      />

      {/* Price Range Filters */}
      <div className="filters">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="filters">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}>


           <option value="all">All Categories</option>
          {categories.map((category,index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
         
        </select>
      </div>


      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Link className='Links' to={`/product/${product.id}`}>
              <img width='200px' src={product.image} alt={product.title} />
              <h3 className='product_name'>{product.title}</h3>
              <p className='price'>${product.price}</p>
              <p className='categoris'>{product.category}</p>
            </Link>
          </div>
        ))}
      </div>


    </div>
  );
};

export default Home;