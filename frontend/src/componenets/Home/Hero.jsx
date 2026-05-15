import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlobeAnimation from './GlobeAnimation'

const Hero = () => {
  return (
    <div className='h-[75vh] flex flex-col md:flex-row items-center justify-center overflow-hidden'>
        <div className='w-full mb-12 md:mb-0 lg:w-3/6 flex flex-col items-center lg:items-start justify-center relative z-20'>
        <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold leading-tight text-yellow-100">
            Discover Your next Great Read
        </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className='mt-4 text-xl text-zinc-300'>Unravel the passion of reading
            </motion.p>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className='mt-8'>
                <Link to ="/all-books"
                 className='text-yellow-100 text-xl lg:text-2xl font-semibold border border-yellow-100 px-10 py-3 hover:bg-zinc-800 transition-all duration-300 rounded-full inline-block'>
                    Discover More
                 </Link>
            </motion.div>
            </div>
        <div className='w-full lg:w-3/6 h-auto lg:h-full flex items-center justify-center relative'>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.4, type: "spring", stiffness: 50 }}
            className="w-full flex justify-center items-center"
          >
            <GlobeAnimation />
          </motion.div>
        
        </div>
    </div>
  )
}

export default Hero