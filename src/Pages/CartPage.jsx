import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    if (user) {
      fetchCartItems();
    }

    // Cleanup listener on component unmount
    return () => unsubscribeAuth();
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const cartCollection = collection(db, 'users', user.uid, 'cart');
      const cartSnapshot = await getDocs(cartCollection);
      const cartList = cartSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(cartList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const cartDocRef = doc(db, 'users', user.uid, 'cart', itemId);
      await deleteDoc(cartDocRef);
      alert('Item removed from cart!');
      fetchCartItems(); // Reload cart after removing an item
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      const cartDocRef = doc(db, 'users', user.uid, 'cart', itemId);
      await updateDoc(cartDocRef, { quantity });
      fetchCartItems(); // Reload cart after updating quantity
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login/signup if not authenticated
    navigate('/account');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-blue-600 text-white py-6 px-6 flex items-center justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight">Your Cart</h2>
          <ShoppingCart className="w-10 h-10" />
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 px-6">
            <p className="text-xl text-gray-500">Your cart is empty</p>
            <Link 
              to="/" 
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-6 hover:bg-blue-50 transition duration-300 ease-in-out"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <img
                      src={item.image || 'vite.svg'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shadow-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-blue-900 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-3">Price: ₹{(item.price || 0).toFixed(2)}</p>
                      <div className="flex items-center space-x-4 bg-blue-100 rounded-full px-2 py-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-blue-600 disabled:opacity-50 hover:bg-blue-200 rounded-full p-1 transition duration-300"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="font-semibold text-blue-900 mx-2">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-blue-600 hover:bg-blue-200 rounded-full p-1 transition duration-300"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-3">
                    <p className="text-2xl font-bold text-blue-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center space-x-1 group"
                    >
                      <Trash2 className="w-5 h-5 group-hover:scale-110 transition duration-300" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="bg-blue-50 p-6 flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
            >
              <ArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
            <div className="text-2xl font-bold text-blue-900">
              Total: ₹{(calculateTotal() || 0).toFixed(2)}
            </div>
            <Link
              to="/checkout"
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <ShoppingCart className="mr-2 w-6 h-6" />
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;