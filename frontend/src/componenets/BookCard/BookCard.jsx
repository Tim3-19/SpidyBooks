import React from "react";
import { Link } from "react-router-dom";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card"; // Make sure path is correct
import axios from "axios";
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
    <div className="w-auto "> {/* Optional wrapper to control width */}
      <Link to={`/view-book-details/${data._id}`}>
        <CardContainer className="inter-var">
          <CardBody className="bg-linear-to-b from-zinc-800 via-zinc-900 to-black relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10 w-82 h-auto rounded-xl p-6 border border-zinc-800">
            
            {/* Image Section - High Depth (translateZ="100") */}
            <CardItem
              translateZ="100"
              className="w-full mt-4"
            >
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
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-white dark:text-black text-black text-xs font-bold"
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
          // Fixed 'bg-yello' to 'bg-yellow' and added text color and margin top
          className="mt-4 px-4 py-2 bg-yellow-100 text-yellow-900 border border-yellow-500 rounded font-semibold hover:bg-yellow-200 transition-all duration-200"
        >
                Remove from fav
              </button>
  }
    </div>
  );
};

export default BookCard;