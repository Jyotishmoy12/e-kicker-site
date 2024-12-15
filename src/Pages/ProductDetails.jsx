import React, { useState } from 'react';
import { ShoppingCart, Heart, Check, Truck, Shield } from 'lucide-react';
import Navbar from "../components/Navbar"

const ProductsDetails = () => {
   
  // Sample product data (in a real app, this would come from an API or route params)
  const product = {
    id: 1,
    name: "Classic Smartphone Pro",
    description: "Experience cutting-edge technology with our most advanced smartphone yet.",
    price: 599.99,
    originalPrice: 699.99,
    rating: 4.5,
    totalReviews: 256,
    availability: "In Stock",
    colors: [
      { name: 'Midnight Blue', code: 'blue' },
      { name: 'Silver', code: 'gray' },
      { name: 'Graphite Black', code: 'black' }
    ],
    storage: [
      { size: '128GB', price: 0 },
      { size: '256GB', price: 50 },
      { size: '512GB', price: 100 }
    ],
    features: [
      "6.7-inch Super Retina XDR Display",
      "A17 Pro Chip with 5-core GPU",
      "Advanced Dual Camera System",
      "5G Capable",
      "Water and Dust Resistant"
    ],
    specifications: {
      display: '6.7-inch OLED',
      processor: 'A17 Pro Chip',
      mainCamera: '48MP + 12MP Ultra Wide',
      frontCamera: '12MP TrueDepth',
      battery: '4352 mAh',
      weight: '240 grams'
    },
    images: [
      "vite.svg",
      "vite.svg",
      "vite.svg",
      "vite.svg",
    ]
  };

  const [selectedStorage, setSelectedStorage] = useState(product.storage[0]);
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`text-xl ${index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <>
    <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="bg-blue-50 rounded-lg mb-4 p-4">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>
          <div className="flex space-x-2">
            {product.images.map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`Product view ${index + 1}`}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer 
                            ${mainImage === img ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {product.name}
          </h1>

          {/* Ratings and Reviews */}
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {renderStars(product.rating)}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-4">
            <span className="text-2xl font-bold text-blue-800 mr-4">
              ${product.price.toFixed(2)}
            </span>
            <span className="line-through text-gray-500">
              ${product.originalPrice.toFixed(2)}
            </span>
            <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4">
            {product.description}
          </p>
          {/* Storage Selection */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Storage</h3>
            <div className="flex space-x-2">
              {product.storage.map((storage) => (
                <button
                  key={storage.size}
                  onClick={() => setSelectedStorage(storage)}
                  className={`
                    px-4 py-2 rounded-lg border 
                    ${selectedStorage.size === storage.size 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-800 border-blue-300'}
                  `}
                >
                  {storage.size} 
                  {storage.price > 0 && ` +$${storage.price}`}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center border rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-blue-800"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-blue-800"
              >
                +
              </button>
            </div>
            <button 
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg 
                         hover:bg-blue-700 transition-colors 
                         flex items-center justify-center"
            >
              <ShoppingCart className="mr-2" />
              Add to Cart
            </button>
            <button 
              className="bg-white border border-blue-300 p-3 rounded-lg 
                         hover:bg-blue-50 transition-colors"
            >
              <Heart className="text-blue-600" />
            </button>
          </div>

          {/* Product Guarantees */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center text-blue-800">
              <Truck className="mr-2" />
              Free Shipping
            </div>
            <div className="flex items-center text-blue-800">
              <Shield className="mr-2" />
              1-Year Warranty
            </div>
            <div className="flex items-center text-blue-800">
              <Check className="mr-2" />
              Easy Returns
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Specifications */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Detailed Specifications
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Features List */}
          <div>
            <h3 className="font-semibold text-blue-800 mb-4">
              Key Features
            </h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li 
                  key={index} 
                  className="flex items-center text-gray-700"
                >
                  <Check className="mr-2 text-blue-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="font-semibold text-blue-800 mb-4">
              Technical Details
            </h3>
            <table className="w-full">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2 text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </td>
                    <td className="py-2 text-blue-900 font-medium">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Customer Reviews
        </h2>
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="text-4xl font-bold text-blue-900 mr-4">
              {product.rating}/5
            </div>
            <div>
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <p className="text-gray-600">
                Based on {product.totalReviews} reviews
              </p>
            </div>
          </div>
          {/* In a real app, you'd map through actual reviews here */}
          <p className="text-gray-700 italic">
            "Reviews section would dynamically load user reviews in a real application."
          </p>
        </div>
      </div>
    </div>
    </>
  );
  
};

export default ProductsDetails