import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaShoppingCart, FaUserCircle, FaBars, FaChevronDown } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const [menu, setMenu] = useState('home');
  const [showCategories, setShowCategories] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const profileRef = useRef();
  const { cartCount } = useCart();

  // Dropdown for categories
  const handleCategoriesToggle = () => setShowCategories((prev) => !prev);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('x-access-token');
    setShowProfileModal(false);
    navigate('/');
  };

  // Redirects to login/signup
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Redirects to cart if logged in, else to login
  const handleCartClick = () => {
    if (localStorage.getItem('x-access-token')) {
      navigate('/cart');
    } else {
      handleLoginClick();
    }
  };

  // Redirects to orders page
  const handleOrdersClick = () => {
    navigate('/transactions');
  };

  // Check if the user is logged in
  const isUserLoggedIn = !!localStorage.getItem('x-access-token');

  // Get username from localStorage or API (for demo, use localStorage)
  useEffect(() => {
    if (isUserLoggedIn) {
      // Try to get username from localStorage (set after login/signup)
      const storedName = localStorage.getItem('username');
      setUsername(storedName || 'User');
    }
  }, [isUserLoggedIn]);

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    }
    if (showProfileModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileModal]);

  return (
    <div className='navbar custom-navbar'>
      {/* LOGO SECTION */}
      <div className='nav-logo custom-nav-logo'>
        <div className='logo-icon-bg'>
          <FaLeaf className='logo-icon' />
        </div>
        <div className='logo-texts'>
          <span className='logo-title'>FarMart</span>
          <span className='logo-subtitle'>Fresh from the Farm</span>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <ul className='nav-menu custom-nav-menu'>
        <li className={menu === 'home' ? 'active' : ''} onClick={() => setMenu('home')}>
          <Link to='/' className='nav-link'>Home</Link>
        </li>
        <li className={menu === 'categories' ? 'active' : ''}>
          <button className='categories-btn' onClick={handleCategoriesToggle}>
            Categories <FaChevronDown className='chevron-icon' />
          </button>
          {showCategories && (
            <div className='categories-dropdown'>
              <Link to='/' className='dropdown-link' onClick={() => { setMenu('categories'); setShowCategories(false); }}>All Categories</Link>
              <Link to='/fruits' className='dropdown-link' onClick={() => { setMenu('categories'); setShowCategories(false); }}>Fruits</Link>
              <Link to='/vegetables' className='dropdown-link' onClick={() => { setMenu('categories'); setShowCategories(false); }}>Vegetables</Link>
              <Link to='/grains' className='dropdown-link' onClick={() => { setMenu('categories'); setShowCategories(false); }}>Grains</Link>
            </div>
          )}
        </li>
        <li className={menu === 'orders' ? 'active' : ''} onClick={() => { setMenu('orders'); handleOrdersClick(); }}>
          <button className='nav-link nav-orders-btn'>Orders</button>
        </li>
        {/* <li className={menu === 'cart' ? 'active' : ''} onClick={() => setMenu('cart')}>
          <Link to='/cart' className='nav-link'>Cart</Link>
        </li> */}
      </ul>

      {/* LOGIN & CART SECTION */}
      <div className='nav-login-cart custom-login-cart'>
        <div className='cart-icon-bg' onClick={handleCartClick}>
          <FaShoppingCart className='cart-icon' />
          {cartCount > 0 && (
            <div className='cart-count-badge'>
              {cartCount > 99 ? '99+' : cartCount}
            </div>
          )}
        </div>
        {isUserLoggedIn ? (
          <div className='nav-profile-section' ref={profileRef}>
            <div className='nav-profile-icon' onClick={() => setShowProfileModal((prev) => !prev)}>
              <FaUserCircle />
            </div>
            {showProfileModal && (
              <div className='nav-profile-dropdown'>
                <div className='profile-modal-username'>
                  {username}
                </div>
                <button className='profile-modal-logout' onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className='nav-login-btn' onClick={handleLoginClick}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};
