import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Changed to standard Bars/Times for clarity
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [mobileNav, setMobileNav] = useState(false);
  
  // Optional: To highlight active link
  const location = useLocation();

  const userLinks = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];

  const adminLinks = [
    { title: "Dashboard", link: "/admin" },
    { title: "Books", link: "/admin/books" },
    { title: "Orders", link: "/admin/orders" },
    { title: "Users", link: "/admin/users" },
    { title: "Profile", link: "/admin/profile" },
  ];

  let visibleLinks = [];
  if (isLoggedIn) {
    visibleLinks = role === "admin" ? adminLinks : userLinks;
  } else {
    visibleLinks = userLinks.filter((l) => !["All Books","Cart", "Profile"].includes(l.title));
  }

  return (
    <>
      {/* Fixed Navbar with Glassmorphism 
        z-50 ensures it floats above everything
      */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700/50 shadow-lg transition-all duration-300">
        
        {/* Container to limit width on large screens */}
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="relative">
                <img 
                    src="/logo.png" 
                    className="h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-300" 
                    alt="logo" 
                />
            </motion.div>
            <span className="text-2xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                SpidyBooks
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
                {visibleLinks.map((item, i) => (
                <Link
                    key={i}
                    to={item.link}
                    className={`relative group text-sm font-medium transition-colors duration-300 ${
                        location.pathname === item.link ? "text-blue-400" : "text-zinc-300 hover:text-white"
                    }`}
                >
                    {item.title}
                    {/* Animated Underline */}
                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-blue-500 transition-all duration-300 ${
                        location.pathname === item.link ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                </Link>
                ))}
            </div>

            {/* Auth Buttons */}
            {!isLoggedIn && (
              <div className="flex gap-4">
                <Link
                  to="/logIn"
                  className="px-5 py-2 text-sm font-semibold text-zinc-300 border border-zinc-600 rounded-full hover:bg-zinc-800 hover:text-white transition-all duration-300"
                >
                  Log In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signUp"
                    className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden text-2xl text-zinc-300 hover:text-white transition"
            onClick={() => setMobileNav(!mobileNav)}
          >
            <FaBars />
          </button>
        </div>
      </motion.nav>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-16"></div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileNav && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-zinc-900 z-50 flex flex-col items-center justify-center gap-8">
              {/* Close Button */}
              <button 
                  className="absolute top-6 right-8 text-3xl text-zinc-400 hover:text-white"
                  onClick={() => setMobileNav(false)}
              >
                  <FaTimes />
              </button>

              {/* Mobile Links */}
              {visibleLinks.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                    to={item.link}
                    onClick={() => setMobileNav(false)}
                    className="text-3xl font-bold text-zinc-300 hover:text-blue-500 transition-colors duration-300"
                    >
                    {item.title}
                    </Link>
                  </motion.div>
              ))}

              {/* Mobile Auth Buttons */}
              {!isLoggedIn && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: visibleLinks.length * 0.1 }}
                    className="flex flex-col gap-4 mt-8 w-full px-12">
                  <Link
                      to="/logIn"
                      onClick={() => setMobileNav(false)}
                      className="w-full py-3 text-center border border-zinc-600 rounded-lg text-xl font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                      Log In
                  </Link>
                  <Link
                      to="/signUp"
                      onClick={() => setMobileNav(false)}
                      className="w-full py-3 text-center bg-blue-600 text-white rounded-lg text-xl font-semibold hover:bg-blue-500"
                  >
                      Sign Up
                  </Link>
                  </motion.div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;