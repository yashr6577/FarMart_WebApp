import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import { MdPerson, MdEmail, MdPublic, MdLocationCity, MdPhoneAndroid, MdLock } from 'react-icons/md';
import farmer1 from '../../assets/farmer1.jpg';
import farmer2 from '../../assets/farmer2.jpg';
import farmer3 from '../../assets/farmer3.jpg';
import farmer4 from '../../assets/farmer4.jpg';

// List of Indian states and their districts
const statesAndDistricts = {
  AndhraPradesh: [
    "Anantapur",
    "Chittoor",
    "Guntur",
    "Kadapa",
    "Krishna",
    "Kurnool",
    "Nellore",
    "Prakasam",
    "Srikakulam",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "East Godavari",
  ],
  ArunachalPradesh: [
    "Tawang",
    "West Kameng",
    "East Kameng",
    "Papum Pare",
    "Kurung Kumey",
    "Kra Daadi",
    "Lower Subansiri",
    "Upper Subansiri",
    "West Siang",
    "East Siang",
    "Upper Siang",
  ],
  Assam: [
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Jorhat",
    "Kamrup",
    "Karbi Anglong",
    "Kokrajhar",
    "Lakhimpur",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "Tinsukia",
    "Dima Hasao",
    "Karimganj",
  ],
  Bihar: [
    "Araria",
    "Arwal",
    "AurangabadA",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Madhepura",
    "Madhubani",
    "Nalanda",
    "Nawada",
    "Purnia",
    "Rohtas",
    "Saran",
    "Sheikhpura",
    "Sitamarhi",
    "Supaul",
    "Vaishali",
    "West Champaran",
  ],
  Chhattisgarh: [
    "Balod",
    "Baloda Bazar",
    "Bemetara",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Kabirdham",
    "Kanker",
    "Korba",
    "Mahasamund",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sukma",
    "Surguja",
  ],
  Goa: ["North Goa", "South Goa"],
  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Dahod",
    "Dangs",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Vadodara",
    "Valsad",
  ],
  Haryana: [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Panchkula",
    "Pehowa",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar",
  ],
  // Other states and districts...
};

export const LoginSignup = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    district: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // Images for the slideshow
  const images = [
    farmer1,
    farmer2,
    farmer3,
    farmer4,
  ];

  useEffect(() => {
    // Image rotation timer
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFadeIn(true);
      }, 1000);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login Function Executed", formData);
    if (!termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://farmtech-kxq6.onrender.com/api/farmers/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: formData.mobile,
          password: formData.password,
        }),
      });
      const responseData = await response.json();
      setLoading(false);
      if (response.ok && responseData.token) {
        localStorage.setItem("x-access-token", responseData.token);
        localStorage.setItem("user", JSON.stringify({
          id: responseData._id,
          name: responseData.name,
          mobile: responseData.mobile,
          email: responseData.email,
        }));
        window.location.replace("/");
      } else {
        alert(responseData.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      alert("Connection error. Please try again later.");
      console.error("Login error:", error);
    }
  };

  const signup = async () => {
    console.log("Sign Up Function Executed", formData);
    if (!termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }
    if (!formData.name || !formData.email || !formData.mobile || !formData.password || !formData.state || !formData.district) {
      alert("Please fill in all fields");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }
    setLoading(true);
    let responseData;
    try {
      const response = await fetch(`https://farmtech-kxq6.onrender.com/api/farmers/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      responseData = await response.json();
      setLoading(false);
      if (responseData.result) {
        alert(responseData.message);
        setState("Login");
      } else {
        alert(responseData.error);
      }
    } catch (error) {
      setLoading(false);
      alert("Connection error. Please try again later.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="login-page-container">
      {/* Loading Overlay (covers entire viewport) */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      <div className="login-card">
        <div className="form-section">
          <div className="form-wrapper">
            <h1>
              {state === "Login"
                ? "Sign in to Farmart"
                : "Create your account"}
            </h1>
            <p className="subtitle">
              {state === "Login"
                ? "Use your mobile number to login:"
                : "Enter your details and start your journey with us!"}
            </p>

            <div className="form-fields">
              {state === "Sign Up" && (
                <>
                  <div className="input-group">
                    <span className="input-icon"><MdPerson /></span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={changeHandler}
                      placeholder=" "
                      required
                      autoComplete="off"
                    />
                    <label htmlFor="name">Your Name</label>
                  </div>

                  <div className="input-group">
                    <span className="input-icon"><MdEmail /></span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={changeHandler}
                      placeholder=" "
                      required
                      autoComplete="off"
                    />
                    <label htmlFor="email">Email Address</label>
                  </div>

                  <div className="input-group">
                    <span className="input-icon"><MdPublic /></span>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={changeHandler}
                      required
                    >
                      <option value="" disabled hidden></option>
                      {Object.keys(statesAndDistricts).map((stateName) => (
                        <option key={stateName} value={stateName}>
                          {stateName.replace(/([A-Z])/g, " $1").trim()}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="state">State</label>
                  </div>
                  <div className="input-group">
                    <span className="input-icon"><MdLocationCity /></span>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={changeHandler}
                      disabled={!formData.state}
                      required
                    >
                      <option value="" disabled hidden></option>
                      {formData.state &&
                        statesAndDistricts[formData.state].map((districtName) => (
                          <option key={districtName} value={districtName}>
                            {districtName}
                          </option>
                        ))}
                    </select>
                    <label htmlFor="district">District</label>
                  </div>
                </>
              )}

              <div className="input-group phone-input">
                <span className="input-icon"><MdPhoneAndroid /></span>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={changeHandler}
                  placeholder=" "
                  pattern="[0-9]{10}"
                  required
                  autoComplete="off"
                />
                <label htmlFor="mobile">Mobile Number</label>
              </div>

              <div className="input-group">
                <span className="input-icon"><MdLock /></span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                  placeholder=" "
                  required
                  minLength="6"
                  autoComplete="off"
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>

            <div className="terms-container">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <label htmlFor="terms">
                  I accept the{" "}
                  <span className="highlight">Terms & Conditions</span>
                </label>
              </div>
            </div>

            <button
              className="submit-button"
              onClick={() => {
                state === "Login" ? login() : signup();
              }}
            >
              {state === "Login" ? "Sign In" : "Create Account"}
            </button>

            <div className="toggle-form">
              {state === "Sign Up" ? (
                <p>
                  Already have an account?
                  <span onClick={() => setState("Login")}>Login</span>
                </p>
              ) : (
                <p>
                  New to Farmart?
                  <span onClick={() => setState("Sign Up")}>Sign Up</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="image-section">
          <div className={`slide-image ${fadeIn ? "fade-in" : "fade-out"}`}>
            <img
              src={images[currentImageIndex]}
              alt={`Farm image ${currentImageIndex + 1}`}
            />
            <div className="image-overlay">
              <h2 className="farmart">
                Welcome to&nbsp;
                <span className="black">Far</span>
                <span className="yellow">mart</span>
              </h2>
              <p>The One-Stop Destination for all your Agriculture Needs.</p>
            </div>
          </div>
          <div className="slideshow-indicators">
            {images.map((_, index) => (
              <div
                key={index}
                className={`indicator ${
                  index === currentImageIndex ? "active" : ""
                }`}
                onClick={() => {
                  setFadeIn(false);
                  setTimeout(() => {
                    setCurrentImageIndex(index);
                    setFadeIn(true);
                  }, 500);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
