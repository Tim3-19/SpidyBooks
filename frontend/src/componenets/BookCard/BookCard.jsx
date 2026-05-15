import React from "react";
import { Link } from "react-router-dom";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card"; // Make sure path is correct
import axios from "axios";
import { motion } from "framer-motion";

const BookCard = ({ data,favourite }) => {
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data._id
  }
  const handleRemoveFav = async() => {
    const response = await axios.put(`http://localhost:5000/api/v1/removeBookFav`,{}, { headers });
    alert(response.data.message);
  }
  if (!data) return null;

  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-auto "> {/* Optional wrapper to control width */}
      <Link to={`/view-book-details/${data._id}`}>
        <CardContainer className="inter-var">
          <CardBody className="bg-zinc-900/80 backdrop-blur-md relative group/card hover:shadow-2xl hover:shadow-[#fde047]/20 w-82 h-auto rounded-xl p-6 border border-zinc-800 hover:border-[#fde047]/50 transition-all duration-300">
            
            {/* Image Section - High Depth (translateZ="100") */}
            <CardItem
              translateZ="100"
              className="w-full mt-4 relative"
            >
              {data.quantity === 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  Out of Stock
                </div>
              )}
              {data.quantity > 0 && data.quantity <= 5 && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md z-10 shadow-[0_0_10px_rgba(253,224,71,0.5)]">
                  Stock is running low
                </div>
              )}
              <div className="w-full h-60 overflow-hidden rounded-xl bg-zinc-900 flex items-center justify-center">
                 <img
                  src={data.url}
                  alt={data.title}
                  className="h-full w-auto object-cover group-hover/card:shadow-xl"
                />
              </div>
            </CardItem>

            {/* Text Section */}
            <div className="mt-8 flex flex-col gap-2">
              
              {/* Title - Medium Depth */}
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-zinc-100 truncate w-full"
              >
                {data.title}
              </CardItem>

              {/* Author - Medium Depth */}
              <CardItem
                as="p"
                translateZ="60"
                className="text-sm text-zinc-400 font-medium"
              >
                by {data.author}
              </CardItem>
             


              {/* Footer (Price & Button) - Low Depth */}
              <div className="flex justify-between items-center mt-6">
                <CardItem
                  translateZ="20"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  <span className="text-xl text-yellow-100 font-bold border border-yellow-500/50 px-3 py-2  rounded-full bg-yellow-500/10">
                    ₹ {data.price}
                  </span>
                </CardItem>
                
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#fde047] to-yellow-500 text-black text-xs font-bold hover:shadow-[0_0_15px_rgba(253,224,71,0.4)] transition-all duration-300"
                >
                  View Details
                </CardItem>
              </div>
            </div>
          </CardBody>
        </CardContainer>
      </Link>
       {favourite &&
              <button 
          // Added onClick handler
          onClick={handleRemoveFav}
          // Updated to premium black and yellow aesthetic
          className="mt-4 w-full px-4 py-2 bg-transparent text-red-500 border border-red-500/50 rounded-lg font-semibold hover:bg-red-500/10 hover:border-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all duration-300"
        >
                Remove from fav
              </button>
  }
    </motion.div>
  );
};

export default BookCard;