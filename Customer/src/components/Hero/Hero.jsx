import React, { useEffect, useState } from 'react';
import './Hero.css';
import { FiTruck, FiStar } from 'react-icons/fi';
import { MdOutlineEco } from 'react-icons/md';
import { HiOutlineHandRaised } from 'react-icons/hi2';
import { IoIosArrowDown } from 'react-icons/io';
import banner1 from '../Assets/banner_vegetables.png';
import banner2 from '../Assets/banner_fruits.png';
import banner3 from '../Assets/banner_organic.png';

const slideImages = [banner1, banner2, banner3];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-main-farmart">
      {/* Left Side */}
      <div className="hero-left-farmart">
        <div className="hero-badge-farmart">
          <MdOutlineEco className="hero-badge-icon-farmart" />
          <span>100% Organic & Fresh</span>
        </div>
        <h1 className="hero-headline-farmart hero-font-heavy">
          Fresh From <span className="hero-green">Farm</span>
        </h1>
        <h1 className="hero-headline-farmart hero-font-heavy">
          Delivered to <span className="hero-yellow">You</span>
        </h1>
        <p className="hero-desc-farmart">
          Connect directly with local farmers and get the freshest produce delivered to your doorstep. Supporting sustainable farming while bringing you nature's finest harvest.
        </p>
        <div className="hero-btn-row-farmart">
          <button className="hero-shop-btn-farmart">
            Shop Now <IoIosArrowDown className="hero-arrow-farmart" />
          </button>
          <button className="hero-learn-btn-farmart">Learn More</button>
        </div>
        <div className="hero-features-farmart">
          <div className="hero-feature-farmart">
            <span className="hero-feature-icon-farmart hero-feature-bg-green"><FiTruck /></span>
            <div>
              <div className="hero-feature-title-farmart hero-font-heavy">Fast Delivery</div>
              <div className="hero-feature-desc-farmart">Same day delivery</div>
            </div>
          </div>
          <div className="hero-feature-farmart">
            <span className="hero-feature-icon-farmart hero-feature-bg-green"><FiStar /></span>
            <div>
              <div className="hero-feature-title-farmart hero-font-heavy">Premium Quality</div>
              <div className="hero-feature-desc-farmart">Hand-picked fresh</div>
            </div>
          </div>
          <div className="hero-feature-farmart">
            <span className="hero-feature-icon-farmart hero-feature-bg-yellow"><HiOutlineHandRaised /></span>
            <div>
              <div className="hero-feature-title-farmart hero-font-heavy">Farm Direct</div>
              <div className="hero-feature-desc-farmart">No middlemen</div>
            </div>
          </div>
        </div>
      </div>
      {/* Right Side - Large image only */}
      <div className="hero-right-farmart">
        <div className="hero-img-card-farmart hero-img-card-farmart-large">
          <img src={slideImages[currentIndex]} alt="Fresh produce" className="hero-img-farmart hero-img-farmart-large" />
        </div>
      </div>
    </div>
  );
};
