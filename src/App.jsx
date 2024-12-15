import React from 'react'
import Home from './Pages/Home'
import ProductDetails from './Pages/ProductDetails'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


const App = () => {
  return (
    <>
    <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/productDetails" element={<ProductDetails/>}/>
        </Routes>
    </Router>
    </>
  )
}

export default App