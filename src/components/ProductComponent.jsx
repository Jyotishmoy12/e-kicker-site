import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductComponent = () => {
  // Sample product data
  const products = [
    {
      id: 1,
      name: "Classic Smartphone",
      description: "Advanced mobile device with cutting-edge features",
      image: "vite.svg",
      price: 599.99,
      originalPrice: 699.99,
      colors: ['black', 'blue', 'silver'],
      ratings: 4.5
    },
    {
      id: 2,
      name: "Wireless Earbuds",
      description: "Noise-cancelling earbuds with long battery life",
      image: "vite.svg",
      price: 129.99,
      originalPrice: 179.99,
      colors: ['white', 'black'],
      ratings: 4.7
    },
    {
      id: 3,
      name: "Smart Watch",
      description: "Fitness tracker with health monitoring features",
      image: "vite.svg",
      price: 249.99,
      originalPrice: 299.99,
      colors: ['blue', 'gray', 'red'],
      ratings: 4.3
    }
  ];

const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`text-lg ${index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-102 hover:shadow-lg"
          >
            {/* Product Image */}
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <button 
                className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white"
              >
                <Heart className="text-red-500 w-4 h-4" />
              </button>
            </div>

            {/* Product Details */}
            <div className="p-3">
              <h3 className="text-lg font-semibold text-blue-900">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.description}</p>

              {/* Pricing and Rating */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-blue-800 mr-2">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm line-through text-gray-500">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    {renderStars(product.ratings)}
                    <span className="ml-1 text-xs text-gray-600">
                      ({product.ratings})
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button 
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-full 
                             hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  <ShoppingCart className="mr-1 w-4 h-4" />
                  Add
                </button>
                <button
                className="bg-blue-600 text-white px-3 py-1.5 rounded-full 
                hover:bg-blue-700 transition-colors flex items-center text-sm"
                ><Link to="/productDetails">View Details</Link></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductComponent;