import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion,AnimatePresence } from "framer-motion";
import { AlertCircle } from 'lucide-react';

const SignUp = () => {
  const [modalConfig, setModalConfig] = useState({
  isOpen: false,
  title: "",
  message: ""
});

// A quick helper function to open errors cleanly
const triggerError = (title, message) => {
  setModalConfig({
    isOpen: true,
    title: title,
    message: message
  });
};
  const navigate = useNavigate();
  
  // State to hold user input
  const [Values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    role: "user",
    confirmPassword: "",
  });

  // Handle Input Changes
  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  // Handle Form Submission
  const submit = async () => {
    try {
      if (
        Values.username === "" || 
        Values.email === "" || 
        Values.password === "" || 
        Values.address === "" ||
        Values.role === ""
      ) {
        triggerError("Required Fields Missing", "Please fill in all fields before submitting your registration.");
        return;
      }
      if (Values.password !== Values.confirmPassword) {
          triggerError("Password Mismatch", "The confirmation password doesn't match your original password.");
          return; // Stop the form submission
      }

      // Send data to backend (Adjust URL if needed)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/sign-up`, Values);
      
      triggerError("Registration Successful",   response.data.message);
      navigate("/LogIn"); // Redirect to login on success
      
    } catch (error) {
      triggerError("Registration Failed", error.response?.data?.message || "An error occurred");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-yellow-950/30 to-black overflow-hidden flex items-center justify-center px-6 py-8">
      <motion.div 
        className="relative z-10 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl px-8 py-10 w-full md:w-3/6 lg:w-2/6 shadow-2xl my-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-100 mb-2">Create an Account</h1>
          <p className="text-zinc-400">Join SpidyBooks to discover your next read</p>
        </motion.div>
        
        <div className="space-y-5">
          <motion.div variants={itemVariants}>
            <label htmlFor="username" className="text-zinc-400 font-medium">Username</label>
            <input
              type="text"
              id="username"
              className="w-full mt-2 bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:border-[#fde047] focus:shadow-[0_0_15px_rgba(253,224,71,0.3)]"
              placeholder="username"
              name="username"
              required
              value={Values.username}
              onChange={change}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="text-zinc-400 font-medium">Email</label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:border-[#fde047] focus:shadow-[0_0_15px_rgba(253,224,71,0.3)]"
              placeholder="xyz@example.com"
              name="email"
              required
              value={Values.email}
              onChange={change}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="text-zinc-400 font-medium">Password</label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:border-[#fde047] focus:shadow-[0_0_15px_rgba(253,224,71,0.3)]"
              placeholder="password"
              name="password"
              required
              value={Values.password}
              onChange={change}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
  <label htmlFor="confirmPassword" className="text-zinc-400 font-medium">Confirm Password</label>
  <input
    type="password"
    id="confirmPassword"
    className="w-full mt-2 bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:border-[#fde047] focus:shadow-[0_0_15px_rgba(253,224,71,0.3)]"
    placeholder="confirm your password"
    name="confirmPassword" // <-- Crucial: Must match your state object key
    required
    value={Values.confirmPassword || ""} // <-- Fallback to empty string if initially undefined
    onChange={change}
  />
</motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="address" className="text-zinc-400 font-medium">Address</label>
            <textarea
              id="address"
              className="w-full mt-2 bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:border-[#fde047] focus:shadow-[0_0_15px_rgba(253,224,71,0.3)]"
              rows="3"
              placeholder="address"
              name="address"
              required
              value={Values.address}
              onChange={change}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="role" className="text-zinc-400 font-medium">Role</label>
            <select
              id="role"
              name="role"
              value={Values.role}
              onChange={change}
              className="w-full mt-2 bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-lg outline-none transition-all duration-300 focus:border-[#fde047] focus:shadow-[0_0_15px_rgba(253,224,71,0.3)]"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <button
              className="w-full bg-gradient-to-r from-[#fde047] to-yellow-500 text-black font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(253,224,71,0.4)] hover:shadow-[0_0_25px_rgba(253,224,71,0.8)] hover:scale-[1.02] transition-all duration-300"
              onClick={submit}
            >
              Sign Up
            </button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-6 border-t border-zinc-800 pt-6">
            <p className="text-center text-zinc-400 font-medium">
              Already have an account? &nbsp;
              <Link to="/LogIn" className="text-[#fde047] hover:text-yellow-300 hover:underline transition-colors">
                Log In
              </Link>
            </p>
          </motion.div>
          
        </div>
      </motion.div>
      {/* Add this at the bottom of your JSX return statement */}
<AnimatePresence>
  {modalConfig.isOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* The Dialog Box */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-2xl"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">
          <AlertCircle size={28} />
        </div>

        {/* Dynamic Title */}
        <h3 className="text-lg font-semibold text-zinc-100">
          {modalConfig.title}
        </h3>
        
        {/* Dynamic Message */}
        <p className="mt-2 text-sm text-zinc-400">
          {modalConfig.message}
        </p>

        <button
          type="button"
          onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-medium text-zinc-950 transition-all duration-200 hover:bg-yellow-300"
        >
          Got it
        </button>
      </motion.div>

    </div>
  )}
</AnimatePresence>
    </div>
  );
};

export default SignUp;