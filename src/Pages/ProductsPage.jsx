import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import ProductComponent from '../components/ProductComponent';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          price: parseFloat(doc.data().price || 0),
          originalPrice: parseFloat(doc.data().originalPrice || 0),
          ratings: parseFloat(doc.data().ratings || 0)
        }));

        setProducts(productList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            All Products
          </h1>
          <ProductComponent products={products} isAllProductsPage={true}/>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ProductsPage;