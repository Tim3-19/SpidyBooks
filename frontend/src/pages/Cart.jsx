import React, { useEffect, useState } from 'react';
import Loader from '../componenets/Loader/Loader';
import axios from 'axios';
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../photos/empty2.png"

const Cart = () => {
  // FIX 1: Hooks must be inside the component
  const navigate = useNavigate();

  // FIX 2: Renamed state to 'cart' (lowercase) to avoid conflict with Component name
  const [cart, setCart] = useState();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get-cart`, { headers });
        setCart(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  let total = 0;
  const groupedCart = [];

  if (cart && cart.length > 0) {
    const map = new Map();
    const populatedObjects = new Map();
    
    cart.forEach((item) => {
      if (item && typeof item === 'object' && item._id) {
        populatedObjects.set(item._id.toString(), item);
      }
    });

    cart.forEach((rawItem) => {
      const itemId = (typeof rawItem === 'object' && rawItem !== null) ? rawItem._id : rawItem;
      const item = populatedObjects.get(itemId?.toString());

      if (item) {
        total += item.price;
        if (map.has(item._id)) {
           map.get(item._id).quantity += 1;
        } else {
           const newItem = { ...item, quantity: 1 };
           map.set(item._id, newItem);
           groupedCart.push(newItem);
        }
      }
    });
  }

  const deleteItem = async (bookId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/remove-from-cart/${bookId}`,
        {},
        { headers }
      );

      alert(response.data.message);
      const updatedCart = cart.filter((item) => item._id !== bookId);
      setCart(updatedCart);

    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    }
  };

  // FIX 3: PlaceOrder is now outside of deleteItem so the button can access it
  const PlaceOrder = async () => {
    try {
      console.log("Sending Cart Data:", cart);
      const response = await axios.post(
       `${import.meta.env.VITE_API_URL}/api/v1/place-order`,
        { order: cart },
        { headers }
      );

      alert(response.data.message);
      setCart([]);
      // After placing the order, send the user to the All Books page
      navigate("/all-books");
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className='bg-zinc-950 px-6 md:px-12 min-h-screen py-10 overflow-x-hidden overflow-y-auto relative font-sans'>
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-500/10 via-zinc-950 to-zinc-950" />

      {/* Cyber-Grid Pattern */}
      {/* Ambient Cinematic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Top Glow */}
        <div className="
    absolute
    top-[-150px]
    left-1/2
    -translate-x-1/2

    w-[700px]
    h-[400px]

    bg-yellow-400/10

    rounded-full
    blur-3xl
  " />

        {/* Left Blue Glow */}
        <div className="
    absolute
    top-[30%]
    left-[-120px]

    w-[350px]
    h-[350px]

    bg-indigo-500/10

    rounded-full
    blur-3xl
  " />

        {/* Right Golden Glow */}
        <div className="
    absolute
    bottom-[10%]
    right-[-100px]

    w-[400px]
    h-[400px]

    bg-yellow-500/10

    rounded-full
    blur-3xl
  " />

        {/* Soft Noise Texture */}
        <div className="
    absolute
    inset-0
    opacity-[0.03]
    mix-blend-soft-light
    bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]
  " />

      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="
absolute
top-0
left-1/2
-translate-x-1/2
w-[600px]
h-[200px]
bg-yellow-400/10
blur-3xl
pointer-events-none
"/>
        {!cart && <div className="mt-20"><Loader /></div>}

        {cart && cart.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-[80vh] flex items-center justify-center flex-col">
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-400 text-center mb-6">
              Your Cart is Empty
            </h1>
            <button
              onClick={() => navigate("/all-books")}
              className="
    mt-8
    px-8 py-4
    rounded-2xl

    bg-gradient-to-r
    from-[#fde047]
    to-yellow-500

    text-black
    font-bold

    hover:scale-105
    transition-all duration-300

    shadow-[0_0_20px_rgba(253,224,71,0.3)]
  "
            >
              Explore Books
            </button>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full" />
              <img
                src={bgImage}
                alt="empty cart"
                className="relative h-[30vh] lg:h-[40vh] drop-shadow-2xl opacity-80"
              />
            </div>
            <p className="text-zinc-500 mt-6 text-lg font-medium">Looks like you haven't added anything yet.</p>
          </motion.div>
        )}

        {cart && cart.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
            <h1 className='text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-[#fde047] drop-shadow-[0_0_15px_rgba(253,224,71,0.3)] mb-10 tracking-tight
leading-none'>
              My Cart
            </h1>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Cart Items */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full lg:w-2/3 flex flex-col gap-6">
                <AnimatePresence>
                  {groupedCart.map((items) => (
                    <motion.div
                      layout
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className='w-full rounded-2xl flex flex-col sm:flex-row p-6 bg-white/[0.03] backdrop-blur-md border border-zinc-800 hover:border-[#fde047]/50 hover:shadow-[0_0_20px_rgba(253,224,71,0.1)] transition-all duration-300 justify-between items-center group before:absolute
before:inset-0
before:bg-gradient-to-br
before:from-white/[0.03]
before:to-transparent
before:pointer-events-none
before:rounded-2xl'
                      key={items._id}
                    >
                      <div className='flex flex-col sm:flex-row items-center sm:items-start w-full sm:w-auto gap-6'>
                        <div className="relative shrink-0">
                          <div className="absolute inset-0 bg-[#fde047]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                          <img
                            src={items.url}
                            alt={items.title}
                            className='relative
h-[16vh]
sm:h-[20vh]

rounded-xl

shadow-[0_15px_40px_rgba(0,0,0,0.5)]

transition-all duration-500

group-hover:scale-105
group-hover:rotate-1'
                          />
                        </div>
                        <div className='w-full sm:w-auto text-center sm:text-left flex flex-col justify-center'>
                          <h1 className='text-2xl text-zinc-100 font-bold group-hover:text-[#fde047] transition-colors duration-300'>
                            {items.title}
                          </h1>
                          <p className='text-zinc-400 mt-2 text-sm max-w-md hidden md:block'>
                            {items.desc && items.desc.length > 100 ? items.desc.slice(0, 100) + '...' : items.desc}
                          </p>
                          <p className='text-zinc-400 mt-2 text-sm max-w-sm hidden sm:block md:hidden'>
                            {items.desc && items.desc.length > 65 ? items.desc.slice(0, 65) + '...' : items.desc}
                          </p>
                        </div>
                      </div>

                      <div className='flex mt-6 sm:mt-0 w-full sm:w-auto items-center justify-between sm:flex-col sm:justify-center gap-4 shrink-0'>
                        <div className='flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-1'>
                          <span className='text-zinc-400 text-sm'>Qty:</span>
                          <span className='text-white font-bold'>{items.quantity}</span>
                        </div>
                        <h2 className='text-[#fde047] text-3xl font-extrabold tracking-wide'>
                          ₹ {items.price * items.quantity}
                        </h2>
                        <button
                          className='bg-transparent text-red-500 border border-red-500/50 rounded-xl p-3 hover:bg-red-500/10 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all flex items-center justify-center gap-2 font-semibold'
                          onClick={() => deleteItem(items._id)}
                        >
                          <AiFillDelete size={20} /> <span className="sm:hidden">Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Order Summary Sidebar */}
              <div className="w-full lg:w-1/3">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='sticky top-10 p-8 bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-zinc-800 shadow-[0_20px_80px_rgba(0,0,0,0.6)] hover:border-yellow-400/30
transition-all duration-500'>
                  <h1 className='text-3xl text-zinc-100 font-bold mb-4'>
                    Order Summary
                  </h1>
                  <div className='h-px w-full bg-zinc-800 mb-6' />

                  <div className='flex items-center justify-between text-lg text-zinc-400 mb-4'>
                    <span>Items</span>
                    <span className="font-semibold text-zinc-200">{cart.length}</span>
                  </div>
                  <div className='flex items-center justify-between text-2xl text-zinc-100 font-bold mb-8'>
                    <span>Total</span>
                    <span className="text-[#fde047]">₹ {total}</span>
                  </div>

                  <button
                    className='w-full bg-gradient-to-r from-[#fde047] to-yellow-500 text-black font-extrabold py-4 rounded-xl shadow-[0_0_15px_rgba(253,224,71,0.4)] hover:shadow-[0_0_25px_rgba(253,224,71,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300'
                    onClick={PlaceOrder}
                  >
                    Place Order Now
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Cart;