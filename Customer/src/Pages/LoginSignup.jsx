import React, { useState } from 'react';
import './CSS/LoginSignup.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { FaLeaf, FaUser, FaPhone, FaLock } from 'react-icons/fa';

export const LoginSignup = () => {
  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    phone: "", // Replace email with phone
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);
    let responseData;
    await fetch('https://fbackend-zhrj.onrender.com/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.result) {
      localStorage.setItem('x-access-token', responseData.token); // Save the token here
      window.location.replace("/"); // Redirect to home
    } else {
      alert(responseData.error);
    }
  };

  const signup = async () => {
    console.log("Sign Up Function Executed", formData);
    let responseData;
    await fetch('https://fbackend-zhrj.onrender.com/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.result) {
      alert("Sign up successful! Please log in."); // Notify the user about the successful signup
      setState("Login"); // Switch to login mode
    } else {
      alert(responseData.error);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async (response) => {
    try {
      const googleToken = response.credential;
      
      // Decode the Google token to get the email
      const decodedToken = jwtDecode(googleToken);
      const email = decodedToken.email;

      // Send only the email to the backend for Google Sign-In
      let responseData;
      await fetch('https://fbackend-zhrj.onrender.com/buyers/gsignin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail: email }),
      })
        .then((response) => response.json())
        .then((data) => (responseData = data));

      if (responseData.result) {
        localStorage.setItem('x-access-token', responseData.token); // Save the token here
        window.location.replace("/"); // Redirect to home
      } else {
        alert(responseData.error);
      }
    } catch (error) {
      console.log('Google Login Error: ', error);
      alert('Google Login Failed');
    }
  };

  return (
    <div className='loginSignup custom-login-bg'>
      <div className="custom-login-leaf">
        <FaLeaf />
      </div>
      <div className="loginSignup-container custom-login-card">
        <h1 className="custom-login-title">
          {state === 'Login' ? (
            <>
              Sign in to <span className="custom-login-brand">FarMart</span>
            </>
          ) : (
            <>
              Create your <span className="custom-login-brand">FarMart</span> account
            </>
          )}
        </h1>
        <div className="custom-login-subtitle">
          {state === 'Login'
            ? 'Access your account to continue shopping'
            : 'Join us to get fresh produce delivered'}
        </div>
        <div className="loginSignup-fields custom-login-fields">
          {state === 'Sign Up' ? (
            <div className="custom-input-group">
              <FaUser className="custom-input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={changeHandler}
                placeholder='Enter your full name'
              />
            </div>
          ) : null}
          <div className="custom-input-group">
            <FaPhone className="custom-input-icon" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={changeHandler}
              placeholder='Enter your phone number'
            />
          </div>
          <div className="custom-input-group">
            <FaLock className="custom-input-icon" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              placeholder='Enter your password'
            />
          </div>
        </div>
        <button className="custom-login-btn-main" onClick={() => { state === 'Login' ? login() : signup(); }}>
          {state === 'Login' ? 'Sign in' : 'Create Account'}
        </button>

        {state === 'Sign Up' ? (
          <p className="loginSignup-login custom-login-link">
            Already have an account?{' '}
            <span onClick={() => { setState("Login"); }}>
              Sign in
            </span>
          </p>
        ) : (
          <p className="loginSignup-login custom-login-link">
            Don't have an account?{' '}
            <span onClick={() => { setState("Sign Up"); }}>
              Sign up
            </span>
          </p>
        )}

        <div className="custom-login-back">
          &larr; Back to Home
        </div>
      </div>
    </div>
  );
};
