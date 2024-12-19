import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Navbar from "../components/Navbar"

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!auth.currentUser) {
        navigate('/account');
        return;
      }

      try {
        const wishlistCollection = collection(db, 'users', auth.currentUser.uid, 'wishlist');
        const wishlistSnapshot = await getDocs(wishlistCollection);
        const items = wishlistSnapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data()
        }));
        setWishlistItems(items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const handleRemoveFromWishlist = async (docId) => {
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'wishlist', docId));
      setWishlistItems(prev => prev.filter(item => item.docId !== docId));
    //   toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      // Add to cart
      const cartCollection = collection(db, 'users', auth.currentUser.uid, 'cart');
      await addDoc(cartCollection, {
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1
      });

      // Remove from wishlist
      await handleRemoveFromWishlist(item.docId);
      toast.success('Item moved to cart');
    } catch (error) {
      console.error('Error moving to cart:', error);
      toast.error('Failed to move item to cart');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">My Wishlist</h1>
        {/* {wishlistItems.length > 0 && (
          <button
            onClick={handleCheckout}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>
        )} */}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.docId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={item.image || 'vite.svg'}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">{item.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-blue-800">₹{item.price?.toFixed(2)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.docId)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
  
};

export default WishlistPage;