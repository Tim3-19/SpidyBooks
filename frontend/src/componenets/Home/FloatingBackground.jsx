import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const languages = [
  "Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "Привет", "こんにちは", 
  "你好", "안녕하세요", "مرحبا", "नमस्ते", "שָׁלוֹם", "Sawubona", "Jambo",
  "World", "Mundo", "Monde", "Mondo", "Welt", "Мир", "世界", "세상", "عالم", "दुनिया",
  "Books", "Libros", "Livres", "Libri", "Bücher", "Книги", "本", "书", "책", "كتب", "किताबें"
];

const FloatingBackground = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate a fixed number of random floating elements on mount
    const numElements = 30;
    const newElements = Array.from({ length: numElements }).map((_, i) => ({
      id: i,
      text: languages[Math.floor(Math.random() * languages.length)],
      x: Math.random() * 100, // percentage string for left
      y: Math.random() * 100, // percentage string for top
      duration: Math.random() * 20 + 20, // 20-40s duration
      delay: Math.random() * -20, // Negative delay to start mid-animation
      size: Math.random() * 1.5 + 0.5, // 0.5rem to 2rem
      opacity: Math.random() * 0.15 + 0.05 // 0.05 to 0.2 opacity (very faint)
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-zinc-900 pointer-events-none">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-radial from-zinc-800/20 via-zinc-900/80 to-black"></div>
      
      {/* Floating text elements */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute text-zinc-400 font-medium whitespace-nowrap"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}rem`,
            opacity: el.opacity,
          }}
          animate={{
            y: [0, -100, 0], // Float up and down
            x: [0, Math.random() * 50 - 25, 0], // Slight horizontal drift
            rotate: [0, Math.random() * 20 - 10, 0]
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "linear",
            delay: el.delay,
          }}
        >
          {el.text}
        </motion.div>
      ))}
      
      {/* Very faint glowing orbs for "stars" or nebulas */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-yellow-500/10 blur-[120px] rounded-full mix-blend-screen"></div>
    </div>
  );
};

export default FloatingBackground;
