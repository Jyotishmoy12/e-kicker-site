import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './Pages/Home'
import ProductDetails from './Pages/ProductDetails'
import Account from './Pages/Account'
import AboutUs from './Pages/AboutUs'
import Careers from './Pages/Careers'
import Services from './Pages/Services'
import Contact from './Pages/Contact'


const App = () => {
  return (
    <>
    <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/productDetails/:id" element={<ProductDetails/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="/about-us" element={<AboutUs/>}/>
            <Route path="/careers" element={<Careers/>}/>
            <Route path="/services" element={<Services/>}/>
            <Route path="/contact" element={<Contact/>}/>
        </Routes>
    </Router>
    </>
  )
}

export default App