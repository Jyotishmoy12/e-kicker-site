import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/productdetails', label: 'Productdetails' },
    { to: '/r&d', label: 'Research' },
    { to: '/bulk', label: 'Bulk' },
    { to: '/account', label: 'Account' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
                           hover:bg-blue-700 transition-colors flex items-center text-sm"
              >
                <ShoppingCart className="mr-1 w-4 h-4" />
                Cart
              </Link>
            </li>
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
                             hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  <ShoppingCart className="mr-1 w-4 h-4" />
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;