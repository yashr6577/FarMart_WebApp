import React, { useState, useEffect } from 'react';
import './CSS/Shop.css';
import { Item } from '../components/Item/Item';
import { FaMapMarkerAlt, FaRedo, FaBoxOpen } from 'react-icons/fa';

const states = [
  'All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState('All States');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://fbackend-zhrj.onrender.com/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter by state
  const filteredProducts = selectedState === 'All States'
    ? products
    : products.filter((p) => p.farmer?.state === selectedState);

  return (
    <div className="shop-main-bg">
      <div className="shop-header">
        <div className="shop-leaf-icon" />
        <h1 className="shop-title">Fresh Products from Local Farms</h1>
        <div className="shop-subtitle">Discover premium quality produce sourced directly from farmers across India.</div>
      </div>
      <div className="shop-toolbar">
        <div className="shop-state-filter">
          <FaMapMarkerAlt className="shop-state-icon" />
          <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="shop-state-dropdown">
            {states.map((state, idx) => (
              <option key={idx} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className="shop-product-count">
          {filteredProducts.length} products available
        </div>
      </div>
      {loading && <div className="shop-loading">Loading...</div>}
      {error && (
        <div className="shop-error-card">
          <div>Failed to fetch products</div>
          <button className="shop-retry-btn" onClick={fetchProducts}><FaRedo /> Try Again</button>
        </div>
      )}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="shop-no-products">
          <FaBoxOpen className="shop-no-products-icon" />
          <div className="shop-no-products-title">No products found</div>
          <div className="shop-no-products-desc">Try selecting a different category or state, or check back later for new products.</div>
        </div>
      )}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="shop-products-grid">
          {filteredProducts.map((product) => (
            <Item
              key={product._id}
              id={product._id}
              name={product.name}
              image={product.image}
              price={product.price}
              type={product.type}
              state={product.farmer?.state}
              district={product.farmer?.district}
              farmerName={product.farmer?.name}
              description={product.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};
