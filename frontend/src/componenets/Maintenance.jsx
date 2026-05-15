import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Wrench } from 'lucide-react'; // Example icons, we can use simple SVGs if lucide-react doesn't have these, but let's assume it does, or fallback to generic ones

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-zinc-950 to-zinc-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto"
      >
        {/* Animated Icon */}
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(253,224,71,0.2)] relative z-10"
          >
            <Settings size={48} className="text-yellow-400" />
          </motion.div>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-[#fde047] mb-6">
          System Maintenance
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
          We are currently upgrading SpidyBooks to bring you a better experience. We will be back online shortly. Thank you for your patience!
        </p>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl max-w-md mx-auto">
          <p className="text-zinc-300 text-sm font-medium">
            Status: <span className="text-yellow-400 font-bold ml-2">Upgrading Systems...</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Maintenance;
