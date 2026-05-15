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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get-all-books`);
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
  className="relative min-h-screen overflow-hidden bg-zinc-950 font-sans"
>
  {/* Dynamic Background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-zinc-950 to-zinc-950" />
  <div className="
absolute
top-[35%]
left-1/2
-translate-x-1/2

w-[1000px]
h-[600px]

bg-yellow-400/5

blur-[180px]

pointer-events-none
"/>

  <div className="relative z-10 min-h-screen px-6 md:px-14 py-10">
      <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.2 }}
  className="relative z-10 mb-10 mt-4 text-center"
>
  <h1
  className="
text-6xl
md:text-8xl

font-black

tracking-[-3px]
leading-[0.95]

text-transparent
bg-clip-text

bg-gradient-to-b 
from-[#fef08a] 
via-[#fde047] 
to-[#ca8a04]


"
>
  Discover All Books
</h1>
  <p className="mt-6 text-lg text-zinc-400 font-medium max-w-2xl mx-auto">
    Explore our hand-picked reads, curated for curious minds. Find your next favorite story right here.
  </p>
  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#fde047] to-transparent mx-auto mt-6 rounded-full shadow-[0_0_15px_rgba(253,224,71,0.8)]" />
</motion.div>
        {loading && (
  <div className="relative z-10 flex items-center justify-center my-20 ">
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