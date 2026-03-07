import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Rbook, setRbook] = useState();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // 1. Fetch Book Data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/book-id/${id}`);
        setRbook(response.data.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [id]);

  // 2. Header Helper
  const getHeaders = () => ({
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
    bookid: id,
  });

  // 3. User Handlers
  const handleFavourite = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/v1/addBookFav', {}, { headers: getHeaders() });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Error adding to favourites");
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/v1/add-to-cart', {}, { headers: getHeaders() });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Error adding to cart");
    }
  };

  // 4. Admin Handlers
  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete('http://localhost:5000/api/v1/delete-book', { headers: getHeaders() });
      alert("Book deleted successfully");
      navigate("/all-books");
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting book");
    }
  };

  const handleEdit = () => {
    navigate(`/updateBook/${id}`); 
  };

  return (
    <>
      {Rbook ? (
        // --- OUTER WRAPPER (Handles the Background Blur) ---
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='relative min-h-screen bg-zinc-900 flex items-center justify-center p-4 md:p-8 overflow-hidden'
        >
          
          {/* Background Image (Blurred) */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center blur-3xl opacity-30 scale-110"
            style={{ backgroundImage: `url(${Rbook.url})` }}
          ></div>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>

          {/* --- PREMIUM GLASS CARD (Main Content) --- */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-6xl bg-zinc-900/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* AMBIENT GLOW BLOBS (The "Beautiful" Inner Light) */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative flex flex-col md:flex-row gap-8 lg:gap-16 p-8 md:p-16">
              
              {/* LEFT: Book Image with Floating Effect */}
              <div className='w-full md:w-2/5 flex justify-center items-center'>
                <div className="relative group w-full max-w-[320px]">
                   {/* Shadow Base - Creates the floating illusion */}
                   <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/40 blur-xl rounded-full"></div>
                   
                   <img 
                     src={Rbook.url} 
                     alt={Rbook.title} 
                     className='relative z-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full h-auto object-cover transform transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]' 
                   />
                </div>
              </div>

              {/* RIGHT: Book Details */}
              <div className='w-full md:w-3/5 flex flex-col justify-center'>
                
                {/* Title Section */}
                <div className="mb-8">
                  <h1 className='text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-lg'>
                    {Rbook.title}
                  </h1>
                  
                  {/* Author Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-zinc-400 text-lg">By</span>
                    <span className="text-zinc-200 text-lg font-semibold bg-zinc-800/50 px-4 py-1 rounded-full border border-zinc-700/50 hover:bg-zinc-800 transition cursor-pointer">
                      {Rbook.author}
                    </span>
                  </motion.div>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className='text-zinc-300/90 text-base md:text-lg leading-relaxed mb-10 text-justify font-light'
                >
                  {Rbook.desc}
                </motion.p>

                {/* Meta Info (Lang & Price) as Structured Glass Pills */}
                <div className="flex flex-wrap items-center gap-6 mb-10">
                   <div className="flex items-center gap-3 bg-black/20 px-5 py-3 rounded-xl border border-white/5 backdrop-blur-sm">
                      <GrLanguage className="text-blue-400 text-xl"/> 
                      <span className="text-zinc-200 font-medium">{Rbook.lang}</span>
                   </div>
                   
                   <div className="flex items-center gap-3 bg-black/20 px-5 py-3 rounded-xl border border-white/5 backdrop-blur-sm">
                      <span className="text-zinc-400 text-sm uppercase font-bold tracking-wider">Price</span>
                      <span className="text-2xl font-bold text-white">
                        ₹ {Rbook.price}
                      </span>
                   </div>
                </div>

                {/* --- BUTTONS SECTION --- */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  
                  {/* USER BUTTONS */}
                  {isLoggedIn === true && role === 'user' && (
                    <>
                      <button 
                        onClick={handleCart}
                        className='flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95 transform hover:-translate-y-1'
                      >
                        <FaShoppingCart /> Add To Cart
                      </button>
                      <button 
                        onClick={handleFavourite}
                        className='flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-zinc-800/50 text-white border border-zinc-600 rounded-xl font-bold text-lg hover:bg-zinc-800 hover:border-red-500 hover:text-red-400 transition-all active:scale-95 group backdrop-blur-sm transform hover:-translate-y-1'
                      >
                        <FaHeart className="text-zinc-500 group-hover:text-red-500 transition-colors" /> Favourite
                      </button>
                    </>
                  )}

                  {/* ADMIN BUTTONS */}
                  {isLoggedIn === true && role === 'admin' && (
                    <>
                      <button 
                        onClick={handleEdit}
                        className='flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30 transform hover:-translate-y-1'
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        onClick={handleDelete}
                        className='flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-red-600/10 text-red-500 border border-red-500/50 rounded-xl font-bold text-lg hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1'
                      >
                        <MdOutlineDelete /> Delete
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <div className='h-screen bg-zinc-900 flex items-center justify-center'>
          <Loader />
        </div>
      )}
    </>
  );
}

export default BookDetails;