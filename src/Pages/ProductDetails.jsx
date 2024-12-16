import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Check, 
  Truck, 
  Shield, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Mock product data (replace with actual data fetching)
  useEffect(() => {
    const products = [
      { 
        id: 1, 
        name: "Classic Smartphone Pro", 
        brand: "TechGiant",
        description: "Experience cutting-edge technology with our advanced smartphone featuring a stunning display and powerful performance.",
        price: 599.99, 
        originalPrice: 699.99, 
        discountPercentage: 14,
        rating: 4.5, 
        totalReviews: 256, 
        images: [
          "https://via.placeholder.com/600x400?text=Phone+Front",
          "https://via.placeholder.com/600x400?text=Phone+Back",
          "https://via.placeholder.com/600x400?text=Phone+Side"
        ],
        specifications: {
          display: '6.7" Super AMOLED',
          processor: 'Octa-core 3.0 GHz',
          ram: '8GB',
          storage: ['128GB', '256GB', '512GB'],
          camera: {
            rear: '108MP Triple Camera',
            front: '32MP Selfie Camera'
          },
          battery: '5000 mAh',
          network: '5G Enabled'
        },
        features: [
          "Advanced AI Photography",
          "Water & Dust Resistant",
          "Fast Charging Support",
          "Face & Fingerprint Unlock"
        ],
        inStock: true
      }
    ];

    const selectedProduct = products.find(p => p.id === parseInt(id));
    setProduct(selectedProduct);
  }, [id]);

  const handleImageChange = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        (prev + 1) % product.images.length
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery Section */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img 
              src={product.images[currentImageIndex]} 
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-[500px] object-cover"
            />
            {/* Image Navigation Buttons */}
            <button 
              onClick={() => handleImageChange('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full"
            >
              <ChevronLeft />
            </button>
            <button 
              onClick={() => handleImageChange('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full"
            >
              <ChevronRight />
            </button>
          </div>
          {/* Thumbnail Preview */}
          <div className="flex justify-center space-x-2 mt-4">
            {product.images.map((img, index) => (
              <img 
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer 
                  ${currentImageIndex === index ? 'border-2 border-blue-500' : 'opacity-50'}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.totalReviews} Reviews)
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-4 flex items-center">
            <span className="text-3xl font-bold text-blue-600">${product.price}</span>
            <span className="ml-4 line-through text-gray-500">${product.originalPrice}</span>
            <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {product.discountPercentage}% OFF
            </span>
          </div>

          {/* Product Highlights */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <Check className="mr-2 text-green-500" />
              <span>In Stock: {product.inStock ? 'Available' : 'Out of Stock'}</span>
            </div>
            <div className="flex items-center">
              <Truck className="mr-2 text-blue-500" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 text-purple-500" />
              <span>1-Year Warranty</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center space-x-4">
            <span>Quantity:</span>
            <div className="flex items-center border rounded">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 bg-gray-100"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button 
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <ShoppingCart className="mr-2" /> Add to Cart
            </button>
            <button 
              className="flex items-center border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              <Heart className="mr-2" /> Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Additional Product Details */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Product Specifications</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Technical Details</h3>
            <ul className="space-y-2">
              <li>Display: {product.specifications.display}</li>
              <li>Processor: {product.specifications.processor}</li>
              <li>RAM: {product.specifications.ram}</li>
              <li>Storage Options: {product.specifications.storage.join(', ')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Camera</h3>
            <ul className="space-y-2">
              <li>Rear Camera: {product.specifications.camera.rear}</li>
              <li>Front Camera: {product.specifications.camera.front}</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Key Features</h3>
          <ul className="list-disc list-inside space-y-2">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;