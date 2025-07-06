import { useState, useEffect, useRef } from 'react';

export function useCartItemQuantity({ item, onRemove, onSetQuantity }) {
  // item.quantity is the max available
  const maxQuantity = item.quantity;
  // Use item.cartQuantity or item.quantityInCart for current in-cart quantity
  const actualCartQty = item.cartQuantity || item.quantityInCart || 1;
  const [currentQty, setCurrentQty] = useState(actualCartQty);
  const [error, setError] = useState('');
  const debounceTimer = useRef();

  // Sync with prop changes (context updates)
  useEffect(() => {
    setCurrentQty(actualCartQty);
  }, [actualCartQty, item._id]);

  // Debounced update logic
  const debouncedUpdate = (newQty) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onSetQuantity(item._id, newQty);
      setError('');
    }, 3000); // 3 seconds
  };

  // Increment handler
  const increment = () => {
    if (currentQty < maxQuantity) {
      const newQty = currentQty + 1;
      setCurrentQty(newQty);
      debouncedUpdate(newQty);
      setError('');
    }
  };

  // Decrement handler
  const decrement = () => {
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      setCurrentQty(newQty);
      debouncedUpdate(newQty);
      setError('');
    } else if (currentQty === 1) {
      // Optionally remove from cart if decremented below 1
      onRemove(item._id);
      setError('');
    }
  };

  // Input handler
  const handleInput = (val) => {
    let newQty = parseInt(val, 10);
    if (isNaN(newQty) || newQty < 1) newQty = 1;
    if (newQty > maxQuantity) newQty = maxQuantity;
    setCurrentQty(newQty);
    debouncedUpdate(newQty);
    setError('');
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return {
    currentQty,
    maxQuantity,
    increment,
    decrement,
    handleInput,
    error,
    setError,
  };
} 