import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ShoppingCart } from 'lucide-react';

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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login/signup if not authenticated
    navigate('/account');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image || 'vite.svg'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">Price: ${(item.price || 0).toFixed(2)}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="bg-blue-600 text-white px-2 py-1 rounded-full hover:bg-blue-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <p className="text-lg font-bold text-blue-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div>
          <Link
            to="/"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300"
          >
            Continue Shopping
          </Link>
        </div>
        <div className="text-xl font-semibold text-blue-800">
          Total: ${(calculateTotal() || 0).toFixed(2)}
        </div>
        <div>
          <Link
            to="/checkout"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 flex items-center"
          >
            <ShoppingCart className="mr-2 w-5 h-5" />
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
