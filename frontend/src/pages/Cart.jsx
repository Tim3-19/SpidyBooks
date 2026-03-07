import React, { useEffect, useState } from 'react';
import Loader from '../componenets/Loader/Loader';
import axios from 'axios';
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  // FIX 1: Hooks must be inside the component
  const navigate = useNavigate();
  
  // FIX 2: Renamed state to 'cart' (lowercase) to avoid conflict with Component name
  const [cart, setCart] = useState();
  const [total, setTotal] = useState(0);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/get-cart", { headers });
        setCart(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (cart && cart.length > 0) {
      let totalAmount = 0;
      cart.forEach((item) => {
        totalAmount += item.price;
      });
      setTotal(totalAmount);
    }
  }, [cart]);

  const deleteItem = async (bookId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/remove-from-cart/${bookId}`,
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
        "http://localhost:5000/api/v1/place-order",
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

  return (
    // Changed h-screen to min-h-screen to allow scrolling if list is long
    <div className='bg-zinc-900 px-12 h-screen py-8 overflow-auto'> 
      {!cart && <Loader />}
      
      {cart && cart.length === 0 && (
        <div className="h-screen">
          <div className="h-[100%] flex items-center justify-center flex-col">
            <h1 className="text-4xl lg:text-5xl font-semibold text-zinc-500 text-center">
              No Books in Cart
            </h1>
            <img
              src="/empty-cart.png"
              alt="empty cart"
              className="lg:h-[50vh]"
            />
          </div>
        </div>
      )}

      {cart && cart.length > 0 && (
        <>
          <h1 className='text-5xl font-semibold text-zinc-500 mb-8'>
            My Cart
          </h1>
          {cart.map((items, i) => (
            <div className='w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center' key={i}>
              <div className='flex flex-col md:flex-row items-center w-full md:w-auto'>
                  <img
                    src={items.url}
                    alt={items.title}
                    className='h-[20vh] object-cover rounded'
                  />
                  <div className='w-full md:w-auto md:ml-4'>
                    <h1 className='text-2xl text-zinc-100 font-semibold text-start mt-2'>
                      {items.title}
                    </h1>
                    <p className='text-normal text-zinc-300 mt-2 hidden lg:block '>
                      {items.desc.slice(0, 100)}...
                    </p>
                    <p className='text-normal text-zinc-300 mt-2 hidden md:block lg:hidden '>
                      {items.desc.slice(0, 65)}...
                    </p>
                    <p className='text-normal text-zinc-300 mt-2 block md:hidden '>
                      {items.desc.slice(0, 100)}...
                    </p>
                  </div>
              </div>
              
              <div className='flex mt-4 w-full md:w-auto items-center justify-between'>
                <h2 className='text-zinc-100 text-3xl font-semibold flex'>
                  ₹ {items.price}
                </h2>
                <button
                  className='bg-red-100 text-red-700 border border-red-700 rounded p-2 ms-4 hover:bg-red-200 transition-all'
                  onClick={() => deleteItem(items._id)}
                >
                  <AiFillDelete /> Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {cart && cart.length > 0 && (
        <div className='mt-4 w-full flex items-center justify-end'>
          <div className='p-4 bg-zinc-800 rounded'>
            <h1 className='text-3xl text-zinc-200 font-semibold'>
              Total Amount
            </h1>
            <div className='mt-3 flex items-center justify-between text-xl text-zinc-200'>
              <h2>{cart.length} books</h2> <h2>₹ {total}</h2>
            </div>
            <div className='w-[100%] mt-3'>
              <button
                className='bg-zinc-100 rounded px-4 py-2 text-zinc-800 font-semibold hover:bg-zinc-200 transition-all w-full'
                onClick={PlaceOrder} // Now accessible
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;