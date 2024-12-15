import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Check, Truck, Shield } from 'lucide-react';
import Navbar from "../components/Navbar"

// Assuming you're fetching data from a mock database or Firebase
const ProductsDetails = () => {
  const { id } = useParams(); // Get product id from the URL

  const [product, setProduct] = useState(null);

  // Example of fetching product from a mock data source (you can use Firebase here)
  useEffect(() => {
    // Normally, you would fetch data from Firebase here.
    // For now, let's use the same static product array for demonstration.
    const products = [
      { 
        id: 1, name: "Classic Smartphone Pro", description: "Description of product 1", price: 599.99, 
        originalPrice: 699.99, rating: 4.5, totalReviews: 256, images: ["vite.svg", "vite.svg"], storage: [{size: '128GB'}]
      },
      { 
        id: 2, name: "Wireless Earbuds", description: "Description of product 2", price: 129.99, 
        originalPrice: 179.99, rating: 4.7, totalReviews: 156, images: ["vite.svg", "vite.svg"], storage: [{size: '64GB'}]
      },
      { 
        id: 3, name: "Smart Watch", description: "Description of product 3", price: 249.99, 
        originalPrice: 299.99, rating: 4.3, totalReviews: 120, images: ["vite.svg", "vite.svg"], storage: [{size: '16GB'}]
      }
    ];

    // Find the product by id
    const productDetails = products.find(product => product.id === parseInt(id));
    setProduct(productDetails);
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // You can add a loading spinner here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Details Render */}
      <h1 className="text-3xl font-bold text-blue-900">{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <div>
        {product.images.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default ProductsDetails;
