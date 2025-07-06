import React, { useState } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

export const Item = (props) => {
  const [added, setAdded] = useState(false);
  const { addToCart, cartItems } = useCart();
  
  // Determine badge color based on type
  const typeColor = props.type === 'fruits' ? '#7bb661' : props.type === 'vegetables' ? '#4ecdc4' : '#f7b731';

  // Add to cart handler
  const handleAddToCart = async () => {
    // Prevent adding if already in cart
    if (cartItems.some(item => item._id === props.id)) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      return;
    }
    try {
      await addToCart(props.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (error) {
      alert(error.message || 'Failed to add to cart');
    }
  };

  return (
    <div className='item modern-item-card'>
      {/* Badges */}
      <div className='item-badges'>
        {props.type && (
          <span className='item-type-badge' style={{ background: typeColor }}>
            {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
          </span>
        )}
        {props.state && (
          <span className='item-state-badge'>
            {props.state}
          </span>
        )}
      </div>
      {/* Product Image */}
      <Link to={`/product/${props.id}`} className='item-img-link'>
        <img onClick={() => window.scrollTo(0, 0)} src={`https://fbackend-zhrj.onrender.com${props.image}`} alt={props.name} className='item-img-modern' />
      </Link>
      {/* Product Info */}
      <div className='item-info-modern'>
        <p className="item-name-modern">{props.name}</p>
        {props.description && <p className='item-desc-modern'>{props.description}</p>}
        <div className='item-farmer-modern'>
          <span>Farmer: <b>{props.farmerName || '-'}</b></span>
          <span className='item-farmer-location'>{props.district}{props.district && props.state ? ',' : ''} {props.state}</span>
        </div>
        <div className='item-bottom-row'>
          <span className='item-price-modern'>₹{props.price}</span>
          <button className='item-add-cart-btn' onClick={handleAddToCart} disabled={added}>
            {added ? 'Added!' : (<><FaPlus className='item-add-cart-icon' /> Add to Cart</>)}
          </button>
        </div>
      </div>
    </div>
  );
};
