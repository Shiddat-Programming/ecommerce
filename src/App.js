
import React from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProductDetails from './pages/ProductDetails'
import { CartProvider } from './context/CartProvider'
import Cart from './pages/Cart'; 



const App = () => {
  return (
    <CartProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart/>} />  
      </Routes>

       <div className='footer'>

       <Footer />
       </div>
 


    </Router>


    </CartProvider>


    
  )
}

export default App