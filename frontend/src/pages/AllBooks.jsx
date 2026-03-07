import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Loader from '../componenets/Loader/Loader'
import BookCard from '../componenets/BookCard/BookCard'
import { motion } from "framer-motion";


const AllBooks = () => {
  
  const [Rbook, setRbook] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async ()=> {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/get-all-books");
        setRbook(response.data.data || []);
      } catch (err) {
        console.error(err);
        setRbook([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);
  const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="
    relative min-h-screen px-6 md:px-14 py-10
    bg-gradient-to-br from-[#07080d] via-[#0b1020] to-[#120b1a]
    overflow-hidden
  "
>
    <div className="relative min-h-screen px-6 md:px-14 py-10 bg-gradient-to-br from-[#07080d] via-[#0b1020] to-[#120b1a] overflow-hidden
  before:absolute before:inset-0 before:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] before:bg-[size:4px_4px] before:opacity-30 before:content-['']">
    <div className="pointer-events-none absolute inset-0 z-0">
  <div className="absolute -top-1/3 -left-1/4 w-[60%] h-[60%] bg-indigo-500/15 rounded-full blur-[140px]" />
  <div className="absolute top-[30%] -right-1/4 w-[55%] h-[55%] bg-purple-500/15 rounded-full blur-[140px]" />
  <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-yellow-400/10 rounded-full blur-[120px]" />
</div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]"></div>
    </div>
      <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.2 }}
  className="relative z-10 mb-10"
>
  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-yellow-100">
    All Books
  </h1>
  <p className="mt-2 text-zinc-400">
    Hand-picked reads curated for curious minds
  </p>
</motion.div>
        {loading && (
  <div className="relative z-10 flex items-center justify-center my-20">
    <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-lg">
      <Loader />
    </div>
  </div>
)}
          <div className="relative z-10 my-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <motion.div
  variants={gridVariants}
  initial="hidden"
  animate="visible"
  className="relative z-10 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
>
  {Rbook.map((items, i) => (
    <motion.div
      key={i}
      variants={cardVariants}
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      
      <BookCard data={items} />
    </motion.div>
  ))}
</motion.div>
    </div>
    </motion.div>
  )
}


export default AllBooks