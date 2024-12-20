import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

const ProductComponent = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(new Set()); // Track wishlisted items
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

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

    // Fetch both cart and wishlist when user is logged in
    if (user) {
      const fetchUserData = async () => {
        try {
          // Fetch cart count
          const cartCollection = collection(db, 'users', user.uid, 'cart');
          const cartSnapshot = await getDocs(cartCollection);
          setCartCount(cartSnapshot.size);

          // Fetch wishlist items
          const wishlistCollection = collection(db, 'users', user.uid, 'wishlist');
          const wishlistSnapshot = await getDocs(wishlistCollection);
          const wishlistProductIds = new Set(
            wishlistSnapshot.docs.map(doc => doc.data().productId)
          );
          setWishlistItems(wishlistProductIds);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }

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
      // Check if product already exists in cart
      const cartCollection = collection(db, 'users', user.uid, 'cart');
      const q = query(cartCollection, where('productId', '==', product.id));
      const cartSnapshot = await getDocs(q);

      if (!cartSnapshot.empty) {
        toast.info('Item is already in your cart!');
        return;
      }

      await addDoc(cartCollection, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      toast.success('Item added to cart!');
      setCartCount(prevCount => prevCount + 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!user) {
      navigate('/account');
      return;
    }

    try {
      const wishlistCollection = collection(db, 'users', user.uid, 'wishlist');
      
      // Check if product is already in wishlist
      if (wishlistItems.has(product.id)) {
        toast.info('Item is already in your wishlist!');
        return;
      }

      await addDoc(wishlistCollection, {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
      
      setWishlistItems(prev => new Set([...prev, product.id]));
      toast.success('Item added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-800">Our Products</h2>
        {user && (
          <div className="flex gap-3 sm:gap-4 text-sm sm:text-base">
            <Link to="/wishlist" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 sm:gap-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              Wishlist ({wishlistItems.size})
            </Link>
            <Link to="/cart" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 sm:gap-2">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              Cart ({cartCount})
            </Link>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-102 hover:shadow-lg">
              <div className="relative">
                <img 
                  src={product.image || 'vite.svg'} 
                  alt={product.name} 
                  className="w-full h-32 sm:h-40 md:h-48 object-cover"
                />
                <button 
                  onClick={() => handleAddToWishlist(product)} 
                  className={`absolute top-1 sm:top-2 right-1 sm:right-2 bg-white/80 p-1 sm:p-1.5 rounded-full hover:bg-white
                    ${wishlistItems.has(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" fill={wishlistItems.has(product.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="p-2 sm:p-3">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-900 truncate">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-blue-800 mr-1 sm:mr-2">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <span className="text-xs sm:text-sm line-through text-gray-500">
                        ₹{product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center mt-0.5 sm:mt-1">
                      <div className="flex text-xs sm:text-sm">
                        {renderStars(product.ratings)}
                      </div>
                      <span className="ml-1 text-xs text-gray-600">
                        ({product.ratings.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto gap-1 sm:gap-2 text-xs">
                    <button 
                      onClick={() => handleAddToCart(product)} 
                      className="flex-1 sm:flex-none bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                      Add
                    </button>
                    <Link 
                      to={`/productDetails/${product.id}`} 
                      className="flex-1 sm:flex-none bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      View
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