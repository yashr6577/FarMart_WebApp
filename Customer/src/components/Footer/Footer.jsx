import React from 'react';
import './Footer.css';

// Replace these with your actual images/paths
import kisanLogo from '../Assets/logo.png';
import farmer from '../Assets/farmer.png';
import facebook from '../Assets/facebook.png';
import linkedin from '../Assets/linkedin.png';
import instagram from '../Assets/instagram.png';

export const Footer = () => {
  return (
    <footer className="footer">
      {/* Main green background container */}
      <div className="footer-content">
        {/* Left Section: Logo Circle & Menu */}
        <div className="footer-left">
          {/* White circle behind the logo */}
          <div className="footer-logo-circle">
            <img src={kisanLogo} alt="KisanKonnect Logo" className="footer-logo" />
          </div>
          <ul className="footer-menu">
            <li>Menu</li>
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Why KisanKonnect?</li>
          </ul>
        </div>

        {/* Middle Section: Contacts */}
        <div className="footer-middle">
          <h3>CONTACTS</h3>
          <p>KisanKonnect Corporate Office</p>
          <p>Plot no C-40, TTI industrial Estate,</p>
          <p>MIDC, Pawane, KoparKhairane, Navi Mumbai, Maharashtra - 400105</p>
          <p>1800 207 9897</p>
          <p>customer@kisankonnect.in</p>
        </div>

        {/* Right Section: Download the App & Social Icons */}
        <div className="footer-right">
          <div className="footer-social">
            <img src={facebook} alt="Facebook" />
            <img src={linkedin} alt="LinkedIn" />
            <img src={instagram} alt="Instagram" />
          </div>
        </div>

        {/* Farmer image on the bottom-right */}
        <div className="footer-farmer">
          <img src={farmer} alt="Farmer" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2023 KisanKonnect | Privacy Policy | Sitemap | Terms & Conditions</p>
      </div>
    </footer>
  );
};
