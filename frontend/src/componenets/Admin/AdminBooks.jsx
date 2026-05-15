import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  
  // Row expansion state
  const [expandedBook, setExpandedBook] = useState(null);
  
  const [formData, setFormData] = useState({
    url: "", title: "", author: "", price: "", desc: "", lang: "", quantity: 0
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("https://spidybooks.onrender.com/api/v1/get-all-books");
      setBooks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentBookId(null);
    setFormData({ url: "", title: "", author: "", price: "", desc: "", lang: "", quantity: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditMode(true);
    setCurrentBookId(book._id);
    setFormData({
      url: book.url,
      title: book.title,
      author: book.author || book.authour, // Handle schema typo 'authour'
      price: book.price,
      desc: book.desc,
      lang: book.lang,
      quantity: book.quantity || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId) => {
    if(window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete("https://spidybooks.onrender.com/api/v1/delete-book", {
          headers: { ...headers, bookid: bookId }
        });
        fetchBooks();
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Error deleting book");
      }
    }
  };

  const updateQuantity = async (bookId, change, currentQty) => {
    if (currentQty + change < 0) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/update-quantity/${bookId}`, { change }, { headers });
      setBooks(books.map(b => b._id === bookId ? { ...b, quantity: (b.quantity || 0) + change } : b));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/v1/update-books`, formData, {
          headers: { ...headers, bookid: currentBookId }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/add-books`, formData, { headers });
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="text-zinc-100 relative">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-yellow-100">Manage Books</h1>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
        >
          <Plus size={20} /> Add New Book
        </button>
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by title..." 
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 rounded-lg outline-none focus:border-yellow-500 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800">
                  <th className="p-4 text-zinc-400 font-medium">Cover</th>
                  <th className="p-4 text-zinc-400 font-medium">Title</th>
                  <th className="p-4 text-zinc-400 font-medium">Author</th>
                  <th className="p-4 text-zinc-400 font-medium">Stock</th>
                  <th className="p-4 text-zinc-400 font-medium">Price</th>
                  <th className="p-4 text-zinc-400 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <React.Fragment key={book._id}>
                    <tr 
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedBook(expandedBook === book._id ? null : book._id)}
                    >
                      <td className="p-4">
                        <img src={book.url} alt={book.title} className="w-12 h-16 object-cover rounded" />
                      </td>
                      <td className="p-4 font-medium">{book.title}</td>
                      <td className="p-4 text-zinc-400">{book.author || book.authour}</td>
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(book._id, -1, book.quantity || 0)} className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white flex items-center justify-center font-bold text-lg leading-none transition-colors disabled:opacity-50" disabled={(book.quantity || 0) <= 0}>-</button>
                          <span className={`font-mono font-bold w-6 text-center ${!book.quantity || book.quantity === 0 ? 'text-red-400' : book.quantity <= 5 ? 'text-yellow-400' : 'text-zinc-100'}`}>{book.quantity || 0}</span>
                          <button onClick={() => updateQuantity(book._id, 1, book.quantity || 0)} className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white flex items-center justify-center font-bold text-lg leading-none transition-colors">+</button>
                        </div>
                      </td>
                      <td className="p-4 text-yellow-500 font-bold">₹{book.price}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-3" onClick={e => e.stopPropagation()}>
                          <button onClick={() => openEditModal(book)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDelete(book._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedBook === book._id && (
                        <motion.tr 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-zinc-900/50 border-b border-zinc-800/50"
                        >
                          <td colSpan="5" className="p-4">
                            <div className="text-sm text-zinc-400 border-l-4 border-yellow-500 pl-4 py-2">
                              <span className="font-bold text-zinc-200">Description:</span>
                              <p className="mt-1 whitespace-pre-wrap">{book.desc || "No description provided."}</p>
                              <div className="mt-2 text-xs">
                                <span className="font-bold text-zinc-200">Language:</span> {book.lang || "Not specified"}
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
                {filteredBooks.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-zinc-500">No books found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950">
                <h2 className="text-2xl font-bold text-yellow-500">{editMode ? 'Edit Book' : 'Add New Book'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-100 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Cover Image URL</label>
                  <input type="text" name="url" value={formData.url} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-yellow-500" placeholder="https://..." />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-400 font-medium mb-1 block">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-yellow-500" />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-medium mb-1 block">Author</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-yellow-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-zinc-400 font-medium mb-1 block">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-yellow-500" />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-medium mb-1 block">Initial Quantity</label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="0" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-yellow-500" />
                  </div>
                  <div>
                    <label className="text-zinc-400 font-medium mb-1 block">Language</label>
                    <input type="text" name="lang" value={formData.lang} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-yellow-500" />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Description</label>
                  <textarea name="desc" value={formData.desc} onChange={handleChange} required rows="4" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-yellow-500 resize-y" />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(253,224,71,0.3)]">
                    {editMode ? 'Save Changes' : 'Add Book'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBooks;
