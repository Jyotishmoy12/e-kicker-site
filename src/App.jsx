import React from 'react'
import Home from './Pages/Home'
import ProductDetails from './Pages/ProductDetails'
import Account from './Pages/Account'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


const App = () => {
  return (
    <>
    <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/productDetails/:id" element={<ProductDetails/>}/>
            <Route path="/account" element={<Account/>}/>
        </Routes>
    </Router>
    </>
  )
}

export default App