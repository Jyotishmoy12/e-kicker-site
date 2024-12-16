import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const ProductComponent = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch products from Firestore - open to everyone
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

    // Fetch cart items when user is logged in
    if (user) {
      const fetchCartCount = async () => {
        const cartCollection = collection(db, 'users', user.uid, 'cart');
        const cartSnapshot = await getDocs(cartCollection);
        setCartCount(cartSnapshot.size);
      };
      fetchCartCount();
    }

    // Cleanup listener on component unmount
    return () => unsubscribeAuth();
  }, [user]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-lg ${index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      navigate('/account');
      return;
    }

    try {
      const cartCollection = collection(db, 'users', user.uid, 'cart');
      await addDoc(cartCollection, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      alert('Item added to cart!');
      setCartCount(prevCount => prevCount + 1); // Update cart count locally
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!user) {
      navigate('/account');
      return;
    }

    try {
      const wishlistCollection = collection(db, 'users', user.uid, 'wishlist');
      await addDoc(wishlistCollection, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
      alert('Item added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add item to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Our Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-102 hover:shadow-lg">
              {/* Product Image */}
              <div className="relative">
                <img src={product.image || 'vite.svg'} alt={product.name} className="w-full h-48 object-cover" />
                <button onClick={() => handleAddToWishlist(product)} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white">
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
                      <span className="text-xl font-bold text-blue-800 mr-2">${product.price.toFixed(2)}</span>
                      <span className="text-sm line-through text-gray-500">${product.originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      {renderStars(product.ratings)}
                      <span className="ml-1 text-xs text-gray-600">({product.ratings.toFixed(1)})</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button onClick={() => handleAddToCart(product)} className="bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors flex items-center text-sm">
                      <ShoppingCart className="mr-1 w-4 h-4" />
                      Add to Cart
                    </button>
                    <Link to={`/productDetails/${product.id}`} className="bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors flex items-center text-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductComponent;
