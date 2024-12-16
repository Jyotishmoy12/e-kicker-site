import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation hook
import { ShoppingCart, Menu, X } from 'lucide-react';
import { getAuth } from 'firebase/auth'; // Assuming you're using Firebase for authentication.
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const location = useLocation(); // Get current route

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch the authenticated user's email and cart count
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserEmail(user.email); // Set the user's email

      // Fetch the user's cart count from Firestore
      const db = getFirestore();
      const userCartRef = doc(db, 'carts', user.uid);
      getDoc(userCartRef).then((docSnap) => {
        if (docSnap.exists()) {
          const cartData = docSnap.data();
          setCartCount(cartData.items ? cartData.items.length : 0);
        } else {
          setCartCount(0); // No cart found
        }
      });
    } else {
      setUserEmail(null); // If no user is logged in
      setCartCount(0); // Reset cart count if no user
    }
  }, []);

  // Define navigation items conditionally
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/r&d', label: 'Research' },
    { to: '/bulk', label: 'Bulk' },
    { to: '/account', label: 'Account' },
    ...(userEmail === 'bhargab@gmail.com' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  // Handle Logout
  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      setUserEmail(null); // Clear user email state after logout
    }).catch((error) => {
      console.error("Logout error: ", error);
    });
  };

  return (
    <header className="bg-blue-50 shadow-md">
      <div className="container mx-auto max-w-screen-xl flex items-center justify-between py-4 px-6 relative">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            className="h-20 w-40 mr-6 hover:scale-105 transition-transform duration-300" 
            src="e-kickerhd.png" 
            alt="logo" 
          />
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu} 
            className="text-blue-800 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <Link 
                  to={to} 
                  className="text-blue-800 font-semibold hover:text-yellow-500 
                             transition-colors duration-300 
                             relative pb-1
                             after:content-[''] after:absolute after:bottom-0 after:left-0 
                             after:w-0 after:h-[2px] after:bg-yellow-500 
                             after:transition-all after:duration-300
                             hover:after:w-full"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link 
                to="/cart" 
                className="bg-blue-600 text-white px-3 py-1.5 rounded-full 
                           hover:bg-blue-700 transition-colors flex items-center text-sm relative"
              >
                <ShoppingCart className="mr-1 w-4 h-4" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            {/* Conditionally render logout button only for regular users */}
            {userEmail && userEmail !== 'bhargab@gmail.com' && location.pathname === '/' && (
              <li>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-red-700"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-blue-50 md:hidden shadow-lg z-20">
            <ul className="flex flex-col items-center py-4 space-y-4">
              {navItems.map(({ to, label }) => (
                <li key={to} className="w-full text-center">
                  <Link 
                    to={to} 
                    onClick={toggleMenu}
                    className="text-blue-800 font-semibold hover:text-yellow-500 
                               transition-colors duration-300 
                               relative pb-1 block
                               after:content-[''] after:absolute after:bottom-0 after:left-0 
                               after:w-0 after:h-[2px] after:bg-yellow-500 
                               after:transition-all after:duration-300
                               hover:after:w-full"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  to="/cart" 
                  onClick={toggleMenu}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-full 
                             hover:bg-blue-700 transition-colors flex items-center text-sm relative"
                >
                  <ShoppingCart className="mr-1 w-4 h-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
              {/* Conditionally render logout button only for regular users */}
              {userEmail && userEmail !== 'bhargab@gmail.com' && location.pathname === '/' && (
                <li>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-red-700"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
