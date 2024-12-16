import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ShoppingCart, 
  Check 
} from 'lucide-react';

const CheckOutPage = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('googlePay');
  const navigate = useNavigate();

  // Fetch cart items and check authentication
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCartItems();
      }
    });

    return () => unsubscribeAuth();
  }, []);

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

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to complete your order');
      return;
    }

    try {
      // Create order in Firestore
      const ordersCollection = collection(db, 'users', user.uid, 'orders');
      const newOrder = {
        ...formData,
        items: cartItems,
        total: calculateTotal(),
        paymentMethod,
        timestamp: new Date(),
        status: 'Pending'
      };

      const orderDocRef = await addDoc(ordersCollection, newOrder);

      // Clear the cart
      const cartCollection = collection(db, 'users', user.uid, 'cart');
      const cartQuery = query(cartCollection);
      const cartSnapshot = await getDocs(cartQuery);
      
      // Delete all cart items
      const deletePromises = cartSnapshot.docs.map(async (cartDoc) => {
        await deleteDoc(doc(db, 'users', user.uid, 'cart', cartDoc.id));
      });

      await Promise.all(deletePromises);

      // Redirect to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          orderId: orderDocRef.id, 
          total: calculateTotal() 
        } 
      });

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // Redirect if no cart items
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6 flex items-center">
            <MapPin className="mr-3 text-blue-600" />
            Shipping Information
          </h2>
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NY"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10001"
                />
              </div>
            </div>

            <div>
              <fieldset className="mt-6">
                <legend className="text-lg font-medium text-gray-900 flex items-center">
                  <CreditCard className="mr-3 text-blue-600" />
                  Payment Method
                </legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="googlePay"
                      name="paymentMethod"
                      type="radio"
                      checked={paymentMethod === 'googlePay'}
                      onChange={() => setPaymentMethod('googlePay')}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label htmlFor="googlePay" className="ml-3 block text-sm font-medium text-gray-700">
                      Google Pay
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <Check className="mr-2" /> Complete Order
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6 flex items-center">
            <ShoppingCart className="mr-3 text-blue-600" />
            Order Summary
          </h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex justify-between items-center border-b pb-4 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image || 'vite.svg'} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-blue-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-blue-800">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutPage;