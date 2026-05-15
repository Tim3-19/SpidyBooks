import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const SignUp = () => {
  const navigate = useNavigate();
  
  // State to hold user input
  const [Values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    role: "user"
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
        alert("All fields are required!");
        return;
      }

      // Send data to backend (Adjust URL if needed)
      const response = await axios.post("http://localhost:5000/api/v1/sign-up", Values);
      
      alert(response.data.message);
      navigate("/LogIn"); // Redirect to login on success
      
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred");
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
    </div>
  );
};

export default SignUp;