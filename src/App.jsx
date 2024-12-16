import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './Pages/Home'
import ProductDetails from './Pages/ProductDetails'
import Account from './Pages/Account'
import AboutUs from './Pages/AboutUs'
import Careers from './Pages/Careers'
import Services from './Pages/Services'
import Contact from './Pages/Contact'
import AdminDashboard from './Pages/AdminDashboard'
import PrivateRoute from './Pages/PrivateRoute'
import CartPage from './Pages/CartPage'


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
            <Route path="/cart" element={<CartPage/>}/>
            <Route path="/admin" element={
          <PrivateRoute adminOnly={true}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        </Routes>
    </Router>
    </>
  )
}

export default App