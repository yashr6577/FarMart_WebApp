import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart items from API
  const fetchCartItems = async () => {
    const token = localStorage.getItem('x-access-token');
    if (!token) {
      setCartItems([]);
      setCartCount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://fbackend-zhrj.onrender.com/buyers/cart', {
        method: 'GET',
        headers: {
          'x-access-token': token,
        },
      });
      const data = await response.json();
      if (data.result) {
        // Aggregate items by productId and count occurrences
        const countMap = {};
        const productMap = {};
        for (const item of data.cart) {
          const id = item._id || item.productId;
          if (!countMap[id]) {
            countMap[id] = 1;
            productMap[id] = item;
          } else {
            countMap[id]++;
          }
        }
        const updatedCart = Object.keys(countMap).map(id => ({
          ...productMap[id],
          cartQuantity: countMap[id],
          quantity: productMap[id].quantity, // max available
        }));
        setCartItems(updatedCart);
        // Calculate total count (sum of all quantities)
        const totalCount = updatedCart.reduce((sum, item) => sum + (item.cartQuantity || 1), 0);
        setCartCount(totalCount);
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem('x-access-token');
    if (!token) {
      throw new Error('Please log in to add items to your cart.');
    }

    try {
      const response = await fetch('https://fbackend-zhrj.onrender.com/buyers/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await response.json();
      if (data.result) {
        // Refresh cart items after adding
        await fetchCartItems();
        return true;
      } else {
        throw new Error(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      throw error;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('x-access-token');
    if (!token) return;

    try {
      const response = await fetch(`https://fbackend-zhrj.onrender.com/buyers/cart/remove`, {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId })
      });
      const data = await response.json();
      if (data.result) {
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem('x-access-token');
    if (!token) return;

    try {
      const response = await fetch('https://fbackend-zhrj.onrender.com/buyers/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      console.log({ productId, newQuantity });
      if (response.status === 404) {
        // Fallback: remove and re-add N times
        await removeFromCart(productId);
        for (let i = 0; i < newQuantity; i++) {
          await addToCart(productId, 1);
        }
        await fetchCartItems();
        return;
      }
      // Only parse JSON if not 404
      const data = await response.json();
      if (data.result) {
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  // Fetch cart items on mount and when token changes
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Listen for storage changes (when user logs in/out)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'x-access-token') {
        fetchCartItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCartItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 