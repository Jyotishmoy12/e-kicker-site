import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
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
import RDPage from './Pages/RDPage'
import CheckOutPage from './Pages/CheckOutPage.jsx'
import OrderConfirmationPage from './Pages/OrderConfirmationPage.jsx'
import SellerForm from './Pages/Seller.jsx'
import SellerProducts from './Pages/SellerProducts.jsx'
import WishlistPage from './Pages/WishlistPage.jsx';
import UserProfile from './Pages/UserProfile.jsx';


const App = () => {
  return (
    <>
    <Router>
    <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/productDetails/:id" element={<ProductDetails/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="/about-us" element={<AboutUs/>}/>
            <Route path="/careers" element={<Careers/>}/>
            <Route path="/services" element={<Services/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/cart" element={<CartPage/>}/>
            <Route path ="/r&d" element={<RDPage/>}/>
            <Route path="/checkout" element={<CheckOutPage/>}/>
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/seller-form" element={<SellerForm />} />
            <Route path="/seller-products" element={<SellerProducts/>} />
            <Route path ="/wishlist" element={<WishlistPage/>}/>
            <Route path="/userprofile" element={<UserProfile/>}/>
            {/* <Route path="/edit-product/:id" component={EditProduct} /> */}
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