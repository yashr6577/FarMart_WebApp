import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shop } from './Pages/Shop';
import { ShopCategory } from './Pages/ShopCategory';
import { Product } from './Pages/Product';
import { LoginSignup } from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import fruits_banner from './components/Assets/fruits_banner.png'; // Add your fruit banner image path
import vegetables_banner from './components/Assets/veggie.png'; // Add your vegetable banner image path
import grains_banner from './components/Assets/grains_banner.png'; // Add your grain banner image path
import { Navbar } from './components/Navbar/Navbar';
import { CartProvider } from './context/CartContext';
import Home from './Pages/Home';

import { Transaction } from './components/Transaction/Transaction';

function App() {
  return (
    <CartProvider>
      <div>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fruits" element={<ShopCategory banner={fruits_banner} category="fruits" />} />
            <Route path="/vegetables" element={<ShopCategory banner={vegetables_banner} category="vegetables" />} />
            <Route path="/grains" element={<ShopCategory banner={grains_banner} category="grains" />} />
            
            <Route path="/product/:id" element={<Product />} />
            <Route path="/transactions" element={<Transaction />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginSignup />} />
          </Routes> 
          {/* <Footer/> */}
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;
