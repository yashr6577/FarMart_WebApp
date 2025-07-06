import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CSS/Product.css'; // Import CSS for styling
import { useCart } from '../context/CartContext';

export const Product = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    // Fetch product details by ID
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://fbackend-zhrj.onrender.com/product/${id}`);
        const data = await response.json();
        setProduct(data); // Assuming the API returns product details
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
      alert('Product added to cart successfully.');
    } catch (error) {
      alert(error.message || 'Failed to add product to cart.');
    }
  };

  // Check if product is already in cart
  const isInCart = cartItems.some(item => item._id === id);

  if (loading) {
    return <div className="product-loading-modern">Loading product details...</div>;
  }

  if (!product) {
    return <div className="product-notfound-modern">Product not found.</div>;
  }

  return (
    <div className="product-modern-bg">
      <div className="product-modern-card">
        {/* Left side: Product Details */}
        <div className="product-modern-left">
          <img src={`https://fbackend-zhrj.onrender.com${product.image}`} alt={product.name} className="product-modern-image" />
        </div>
        {/* Right side: Details */}
        <div className="product-modern-right">
          <h1 className="product-modern-name">{product.name}</h1>
          <div className="product-modern-type-row">
            <span className="product-modern-type-badge">{product.type}</span>
            <span className="product-modern-qty-badge">Stock: {product.quantity}</span>
          </div>
          <div className="product-modern-price-row">
            <span className="product-modern-price">₹{product.price}</span>
            <span className="product-modern-unit">{product.unit ? `/ ${product.unit}` : ''}</span>
          </div>
          <div className="product-modern-desc">{product.description}</div>
          <div className="product-modern-expiry">Expiry: {new Date(product.expiryDate).toLocaleDateString()}</div>
          <div className="product-modern-farmer-card">
            <div className="product-modern-farmer-title">Farmer Details</div>
            <div className="product-modern-farmer-row"><b>Name:</b> {product.farmer.name}</div>
            <div className="product-modern-farmer-row"><b>Phone:</b> {product.farmer.phone}</div>
            <div className="product-modern-farmer-row"><b>State:</b> {product.farmer.state}</div>
            <div className="product-modern-farmer-row"><b>District:</b> {product.farmer.district}</div>
          </div>
          <div className="product-modern-cart-row">
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min={1} 
              className="product-modern-qty-input"
            />
            <button 
              className="product-modern-addcart-btn" 
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {isInCart ? 'Already in Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
