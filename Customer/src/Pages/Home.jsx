import React from 'react';
import { Hero } from '../components/Hero/Hero';
import { Shop } from './Shop';

const Home = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #f7fbe8 0%, #f7fbe8 60%, #f5f9d2 100%)', minHeight: '100vh' }}>
      <Hero />
      <div style={{ marginTop: '0', paddingTop: '0' }}>
        <Shop />
      </div>
    </div>
  );
};

export default Home; 