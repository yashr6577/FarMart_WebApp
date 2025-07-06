import React from 'react';
import './CartItems.css';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCartItemQuantity } from './useCartItemQuantity';

const CartItems = ({ item, onRemove, onSetQuantity }) => {
  const {
    currentQty,
    maxQuantity,
    increment,
    decrement,
    handleInput,
    error,
  } = useCartItemQuantity({ item, onRemove, onSetQuantity });

  // Calculate total price for this item using the actual cart quantity
  const totalPrice = (item.price * (item.cartQuantity || item.quantityInCart || currentQty)).toFixed(2);
  const isAtMax = currentQty >= maxQuantity;

  return (
    <div className="cartitem-imagecard">
      <button className="cartitem-imagecard-remove" onClick={() => onRemove(item._id)}><FaTrash /></button>
      <img src={`https://fbackend-zhrj.onrender.com${item.image}`} alt={item.name} className="cartitem-imagecard-img" />
      <div className="cartitem-imagecard-details">
        <div className="cartitem-imagecard-name">{item.name}</div>
        <div className="cartitem-imagecard-desc">{item.description}</div>
        <div className="cartitem-imagecard-state">{item.farmer?.state}</div>
        <div className="cartitem-imagecard-price">₹{item.price}{item.unit ? `/${item.unit}` : ''}</div>
      </div>
      <div className="cartitem-imagecard-actions-vertical">
        <div className="cartitem-imagecard-qtybox">
          <button className="cartitem-imagecard-qtybtn" onClick={decrement}><FaMinus /></button>
          <input
            type="text"
            value={currentQty}
            min={1}
            max={maxQuantity}
            className="cartitem-imagecard-qtyinput"
            onChange={e => handleInput(e.target.value)}
          />
          <button
            className="cartitem-imagecard-qtybtn"
            onClick={increment}
            disabled={isAtMax}
            title={isAtMax ? 'Max available reached' : ''}
          >
            <FaPlus />
          </button>
        </div>
        {error && <div className="cartitem-error-message">{error}</div>}
        <span className="cartitem-imagecard-total">₹{totalPrice}</span>
      </div>
      {/* Max quantity at lower left */}
      {typeof maxQuantity === 'number' && (
        <div className="cartitem-max-qty">Max: {maxQuantity}</div>
      )}
    </div>
  );
};

export default CartItems;
