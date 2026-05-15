import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {authActions} from "../store/auth";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // State for Login inputs (Only Username & Password needed)
  const [Values, setValues] = useState({
    username: "",
    password: "",
  });

  // Handle Input Changes
  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  // Handle Login Submission
  const submit = async () => {
    try {
      if (Values.username === "" || Values.password === "") {
        alert("All fields are required!");
        return;
      }

      // 1. Send Login Request
      const response = await axios.post("http://localhost:5000/api/v1/sign-in", Values);

      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.role));
      // 2. Save the Token & User ID locally (CRITICAL STEP)
      
      // This allows you to stay logged in when you refresh
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role); // Optional: If you have admin roles

      // 3. Navigate to Home Page or Admin Dashboard
      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Handle Errors (Wrong password, User not found, etc.)
      alert(error.response.data.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-950 via-yellow-950/30 to-black overflow-hidden flex items-center justify-center px-6 py-8">
      <motion.div 
        className="relative z-10 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl px-8 py-10 w-full md:w-3/6 lg:w-2/6 shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-100 mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Log in to continue your reading journey</p>
        </motion.div>
        
        <div className="space-y-5" onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}>
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

          <motion.div variants={itemVariants} className="pt-2">
            <button
              className="w-full bg-gradient-to-r from-[#fde047] to-yellow-500 text-black font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(253,224,71,0.4)] hover:shadow-[0_0_25px_rgba(253,224,71,0.8)] hover:scale-[1.02] transition-all duration-300"
              onClick={submit}
            >
              Log In
            </button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-6 border-t border-zinc-800 pt-6">
            <p className="text-center text-zinc-400 font-medium">
              Don't have an account? &nbsp;
              <Link to="/SignUp" className="text-[#fde047] hover:text-yellow-300 hover:underline transition-colors">
                Sign Up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;