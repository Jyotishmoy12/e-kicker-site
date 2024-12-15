import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-blue-50 shadow-md">
      <div className="container mx-auto max-w-screen-xl flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <img 
            className="h-20 w-40 mr-6 hover:scale-105 transition-transform duration-300" // Increased height and fixed width
            src="e-kickerhd.png" 
            alt="logo" 
          />
        </div>
        <nav>
          <ul className="flex space-x-6">
            {[{ to: '/', label: 'Home' },
              { to: '/productdetails', label: 'Productdetails' },
              { to: '/r&d', label: 'Research' },
              { to: '/bulk', label: 'Bulk' },
              { to: '/account', label: 'Account' }]
              .map(({ to, label }) => (
              <li key={to}>
                <Link 
                  to={to} 
                  className="text-blue-800 font-semibold hover:text-yellow-500 
                             transition-colors duration-300 
                             border-b-2 border-transparent hover:border-yellow-500 
                             pb-1"
                >
                  {label}
                </Link>
              </li>
            ))}
            {/* Add the ShoppingCart button as a NavLink after "Account" */}
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
      </div>
    </header>
  );
}

export default Header;
