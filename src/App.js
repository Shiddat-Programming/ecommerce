
import React from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProductDetails from './pages/ProductDetails'


const App = () => {
  return (
 
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductDetails />} /> 
      </Routes>

       <div className='footer'>

       <Footer />
       </div>
 


    </Router>





    
  )
}

export default App