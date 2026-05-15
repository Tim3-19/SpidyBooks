import React, { useState, useEffect } from 'react';
import axios from 'axios'
import BookCard from "../BookCard/BookCard"
import Loader from '../Loader/Loader';
import { motion } from 'framer-motion';

const Recent = () => {
  const [Rbook, setRbook] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async ()=> {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/recent-added");
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (

    <div className='mt-8 px-4 overflow-hidden'>
        <motion.h4 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.8 }}
          className='text-3xl text-yellow-100'>
          Recently Added books
        </motion.h4>
        {loading && (
          <div className='flex items-center justify-center my-8'>
             <Loader/>
          </div>)}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {Rbook.map((items,i)=>(
            <motion.div key={i} variants={itemVariants}>
              <BookCard data={items} />
            </motion.div>))}
        </motion.div>
    </div>
  )
}

export default Recent