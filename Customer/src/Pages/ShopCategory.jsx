import React, { useState, useEffect } from 'react'; 
import './CSS/ShopCategory.css';
import { Item } from '../components/Item/Item';
import { FaBoxOpen } from 'react-icons/fa';

export const ShopCategory = (props) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedState, setSelectedState] = useState('All States');
  const [loading, setLoading] = useState(true);

  const states = ['All States', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  useEffect(() => {
    // Fetching all products with farmer details from the AP
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fbackend-zhrj.onrender.com/products'); // Replace with the actual API endpoint
        const data = await response.json();
        setProducts(data);  // Assuming the data is an array of products
        setFilteredProducts(data); // Initially, show all products
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handler for filtering products by state
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);

    if (state === 'All States') {
      setFilteredProducts(products); // Show all products if no specific state is selected
    } else {
      setFilteredProducts(products.filter(product => product.farmer.state === state));
    }
  };

  return (
    <div className="shopcategory-main-bg">
      <div className="shopcategory-header-card">
        <img className="shopcategory-banner-left" src={props.banner} alt="" />
        <div className="shopcategory-header-content">
          <h1 className="shopcategory-title">{props.category ? props.category.charAt(0).toUpperCase() + props.category.slice(1) : 'Category'} Market</h1>
          <div className="shopcategory-subtitle">Browse premium quality {props.category || ''} directly from local farmers.</div>
        </div>
        <img className="shopcategory-banner-right" src={props.banner} alt="" />
      </div>
      <div className="shopcategory-toolbar">
        <div className="shopcategory-state-filter">
          <span>Sort by State</span>
          <select value={selectedState} onChange={handleStateChange} className="shopcategory-state-dropdown">
            {states.map((state, index) => (
              <option key={index} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className="shopcategory-product-count">
          {filteredProducts.filter((item) => item.type === props.category).length} products available
        </div>
      </div>
      {loading ? (
        <div className="shopcategory-loading"><div className="shopcategory-spinner"></div>Loading products...</div>
      ) : (
        <>
          {filteredProducts.filter((item) => item.type === props.category).length === 0 ? (
            <div className="shopcategory-empty-block">
              <FaBoxOpen className="shopcategory-empty-icon" />
              <div className="shopcategory-empty-title">No products found</div>
              <div className="shopcategory-empty-desc">Try selecting a different state or check back later for new arrivals.</div>
            </div>
          ) : (
            <div className="shopcategory-products-grid">
              {filteredProducts
                .filter((item) => item.type === props.category)
                .map((item, i) => (
                  <Item
                    key={i}
                    id={item._id}
                    name={item.name}
                    image={item.image}
                    price={item.price}
                    state={item.farmer.state}
                    district={item.farmer.district}
                    farmerName={item.farmer.name}
                    description={item.description}
                  />
                ))}
            </div>
          )}
        </>
      )}
      <div className="shopcategory-loadmore-modern">
        Explore more
      </div>
    </div>
  );
};
