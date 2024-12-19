import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  addDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../firebase';
import { Trash2, Edit, PlusCircle, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    ratings: 0
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    category: '',
    fileUrl: '',
  });
  const [documentFile, setDocumentFile] = useState(null);

  // Utility function to safely convert to number
  const safeParseFloat = (value, defaultValue = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  useEffect(() => {
    const checkAdminAccess = () => {
      const user = auth.currentUser;
      if (!user || user.email !== 'bhargab@gmail.com') {
        navigate('/account');
        return false;
      }
      return true;
    };

    const loadData = async () => {
      if (checkAdminAccess()) {
        try {
          // Load Products
          const productsCollection = collection(db, 'products');
          const productSnapshot = await getDocs(productsCollection);
          const productList = productSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            price: safeParseFloat(doc.data().price),
            originalPrice: safeParseFloat(doc.data().originalPrice),
            ratings: safeParseFloat(doc.data().ratings)
          }));
          setProducts(productList);

          // Load Documents
          const documentsCollection = collection(db, 'r&d-documents');
          const documentSnapshot = await getDocs(documentsCollection);
          const documentList = documentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setDocuments(documentList);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
    };

    loadData();
  }, [navigate]);


  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    try {
      if (!documentFile) {
        toast.info('Please select a document to upload');
        return;
      }

      const storageRef = ref(storage, `r&d-documents/${Date.now()}_${documentFile.name}`);
      const snapshot = await uploadBytes(storageRef, documentFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const docRef = await addDoc(collection(db, 'r&d-documents'), {
        ...newDocument,
        fileUrl: downloadURL,
        fileName: documentFile.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: auth.currentUser.email
      });

      setDocuments([...documents, { 
        id: docRef.id, 
        ...newDocument,
        fileUrl: downloadURL,
        fileName: documentFile.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: auth.currentUser.email
      }]);

      // Reset form
      setNewDocument({
        title: '',
        description: '',
        category: '',
        fileUrl: '',
      });
      setDocumentFile(null);

      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await deleteDoc(doc(db, 'r&d-documents', documentId));
      setDocuments(documents.filter(d => d.id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async () => {
    if (!imageFile) return null;
    try {
      const storageRef = ref(storage, `product-images/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Upload image if present
      const imageUrl = await uploadImage();

      const docRef = await addDoc(collection(db, 'products'), {
        ...newProduct,
        image: imageUrl || 'vite.svg', // fallback to default image
        price: safeParseFloat(newProduct.price),
        originalPrice: safeParseFloat(newProduct.originalPrice),
        ratings: safeParseFloat(newProduct.ratings)
      });

      setProducts([...products, { 
        id: docRef.id, 
        ...newProduct,
        image: imageUrl || 'vite.svg',
        price: safeParseFloat(newProduct.price),
        originalPrice: safeParseFloat(newProduct.originalPrice),
        ratings: safeParseFloat(newProduct.ratings)
      }]);
      
      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        image: '',
        ratings: 0
      });
      setImageFile(null);
      setImagePreview(null);
      
      // Show success message
      toast.success('Product added successfully');
      
      // Redirect to home route
      navigate('/');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      // Upload image if a new image is selected
      const imageUrl = imageFile ? await uploadImage() : editingProduct.image;

      const productRef = doc(db, 'products', editingProduct.id);
      const updatedProduct = {
        ...editingProduct,
        image: imageUrl,
        price: safeParseFloat(editingProduct.price),
        originalPrice: safeParseFloat(editingProduct.originalPrice),
        ratings: safeParseFloat(editingProduct.ratings)
      };

      await updateDoc(productRef, updatedProduct);

      setProducts(products.map(p => 
        p.id === editingProduct.id ? updatedProduct : p
      ));
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview(null);
      toast.success('Product updated successfully');
      
      // Redirect to home route
      navigate('/');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };


  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Admin Dashboard</h1>
        <button 
          onClick={() => {
            auth.signOut();
            navigate('/account');
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Add/Edit Product Form */}
      <form 
        onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={editingProduct ? editingProduct.name : newProduct.name}
            onChange={(e) => 
              editingProduct 
                ? setEditingProduct({...editingProduct, name: e.target.value})
                : setNewProduct({...newProduct, name: e.target.value})
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={editingProduct ? editingProduct.description : newProduct.description}
            onChange={(e) => 
              editingProduct 
                ? setEditingProduct({...editingProduct, description: e.target.value})
                : setNewProduct({...newProduct, description: e.target.value})
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={editingProduct ? editingProduct.price : newProduct.price}
            onChange={(e) => 
              editingProduct 
                ? setEditingProduct({...editingProduct, price: e.target.value})
                : setNewProduct({...newProduct, price: e.target.value})
            }
            className="border p-2 rounded"
            required
            step="0.01"
          />
          <input
            type="number"
            placeholder="Original Price"
            value={editingProduct ? editingProduct.originalPrice : newProduct.originalPrice}
            onChange={(e) => 
              editingProduct 
                ? setEditingProduct({...editingProduct, originalPrice: e.target.value})
                : setNewProduct({...newProduct, originalPrice: e.target.value})
            }
            className="border p-2 rounded"
            required
            step="0.01"
          />
          
          <input
            type="number"
            placeholder="Ratings"
            value={editingProduct ? editingProduct.ratings : newProduct.ratings}
            onChange={(e) => 
              editingProduct 
                ? setEditingProduct({...editingProduct, ratings: e.target.value})
                : setNewProduct({...newProduct, ratings: e.target.value})
            }
            className="border p-2 rounded"
            step="0.1"
            max="5"
          />
          
          {/* Image Upload Input */}
          <div className="col-span-2 flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageUpload"
            />
            {/* <label 
              htmlFor="imageUpload" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer"
            >
              <Upload className="mr-2" /> 
              {imagePreview || (editingProduct && editingProduct.image) 
                ? 'Change Image' 
                : 'Upload Image'}
            </label> */}
            {(imagePreview || (editingProduct && editingProduct.image)) && (
              <img 
                src={imagePreview || (editingProduct && editingProduct.image)} 
                alt="Product Preview" 
                className="w-20 h-20 object-cover rounded"
              />
            )}
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PlusCircle className="mr-2" /> 
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setImagePreview(null);
                setImageFile(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img 
              src={product.image || 'vite.svg'} 
              alt={product.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold text-blue-800">
                    ${(product.price || 0).toFixed(2)}
                  </span>
                  <span className="ml-2 line-through text-gray-500">
                    ${(product.originalPrice || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setImagePreview(product.image);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Ratings: {(product.ratings || 0).toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">R&D Document Upload</h2>
        <form 
          onSubmit={handleDocumentUpload}
          className="bg-white p-6 rounded-lg shadow-md mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Document Title"
              value={newDocument.title}
              onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newDocument.description}
              onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newDocument.category}
              onChange={(e) => setNewDocument({...newDocument, category: e.target.value})}
              className="border p-2 rounded"
              required
            />
            <div className="col-span-2 flex items-center space-x-4">
              <input
                type="file"
                onChange={handleDocumentFileChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Upload className="mr-2" /> Upload Document
            </button>
          </div>
        </form>

        {/* Document List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{doc.title}</h3>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 />
                </button>
              </div>
              <p className="text-gray-600 mb-2">{doc.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Category: {doc.category}
                </span>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FileText className="mr-1" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;