import React, { useState } from 'react';
import CartItems from '../components/CartItems/CartItems';
import './CSS/Cart.css';
import { FaArrowLeft, FaBoxOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, clearCart, loading, addToCart, fetchCartItems } = useCart();

    const handleRemoveItem = async (productId) => {
        await removeFromCart(productId);
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        await updateQuantity(productId, newQuantity);
    };

    // Handler to set quantity using remove + add logic
    const handleSetQuantity = async (productId, newQuantity) => {
        await removeFromCart(productId);
        for (let i = 0; i < newQuantity; i++) {
            await addToCart(productId, 1);
        }
        await fetchCartItems();
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }
        setProcessing(true);
        try {
            const products = cartItems.map(item => ({
                productId: item._id,
                quantity: item.quantity || 1,
            }));
            const response = await fetch('https://fbackend-zhrj.onrender.com/buyers/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('x-access-token'),
                },
                body: JSON.stringify({ products }),
            });
            const data = await response.json();
            if (data.result) {
                alert(`Transaction completed successfully! Total Bill: ₹${data.totalBill}`);
                // Store cart product details in localStorage for transaction display
                if (data.transactionId || data.orderId || data._id) {
                  const txId = data.transactionId || data.orderId || data._id;
                  const txProducts = cartItems.map(item => ({
                    _id: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                    farmer: item.farmer,
                    description: item.description,
                    unit: item.unit,
                  }));
                  let txMap = {};
                  try {
                    txMap = JSON.parse(localStorage.getItem('transactionProductsMap') || '{}');
                  } catch {}
                  txMap[txId] = txProducts;
                  localStorage.setItem('transactionProductsMap', JSON.stringify(txMap));
                }
                clearCart();
            } else {
                alert('Transaction failed: ' + data.error);
            }
        } catch (error) {
            alert('Transaction failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleClearCart = () => {
        clearCart();
    };

    if (loading) {
        return <div className='cart-loading'>Loading cart items...</div>;
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price * (item.cartQuantity || item.quantityInCart || 1)),
      0
    );
    const delivery = 0;
    const total = subtotal + delivery;

    return (
        <div className='cart-main-bg'>
            <div className='cart-header-row'>
                <span className='cart-back-link' onClick={() => navigate('/')}> <FaArrowLeft /> Continue Shopping</span>
            </div>
            <div className='cart-title-block'>
                <h1 className='cart-title'>Shopping Cart</h1>
                <div className='cart-subtitle'>Review your items and proceed to checkout</div>
            </div>
            {cartItems.length === 0 ? (
                <div className='cart-empty-block'>
                    <FaBoxOpen className='cart-empty-icon' />
                    <div className='cart-empty-title'>Your cart is empty</div>
                    <div className='cart-empty-desc'>Add some fresh products to get started!</div>
                    <button className='cart-empty-btn' onClick={() => navigate('/')}>Start Shopping</button>
                </div>
            ) : (
                <div className='cart-content-row'>
                    <div className='cart-items-card'>
                        <div className='cart-items-title'>Cart Items</div>
                        <div className='cart-items-list'>
                            {cartItems.map(item => (
                                <CartItems
                                    key={item._id}
                                    item={item}
                                    onRemove={handleRemoveItem}
                                    onSetQuantity={handleSetQuantity}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='cart-summary-card'>
                        <div className='cart-summary-title'>Order Summary</div>
                        <div className='cart-summary-row'>
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className='cart-summary-row'>
                            <span>Delivery</span>
                            <span className='cart-summary-free'>Free</span>
                        </div>
                        <div className='cart-summary-total-row'>
                            <span>Total</span>
                            <span className='cart-summary-total'>₹{total.toFixed(2)}</span>
                        </div>
                        <button className='cart-summary-checkout-btn' onClick={handleCheckout} disabled={processing}>
                            {processing ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                        <button className='cart-summary-clear-btn' onClick={handleClearCart}>
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
