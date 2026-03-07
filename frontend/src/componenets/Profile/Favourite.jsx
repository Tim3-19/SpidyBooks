import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BookCard from '../BookCard/BookCard'
import bgImage from "../../photos/bg-1.jpg";


const Favourite = () => {
  const [fav, setfav] = useState([])

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/getFavBooks",
          { headers }
        )
        setfav(response.data.data)
      } catch (error) {
        console.error("Error fetching:", error)
      }
    }
    fetch()
  }, []) // ❗ IMPORTANT: keep [] (not fav)

  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* 🌌 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110
             brightness-110 contrast-110 saturate-110"
        style={{
          backgroundImage:
            `url(${bgImage})`,
        }}
      />

      {/* 🌑 Dark Overlay */}4<div className="absolute inset-0 bg-gradient-to-b 
  from-black/50 via-[#05070F]/60 to-black/70" />

      

      {/* 🌠 Content */}
      <div className="relative z-10 px-4 md:px-12 py-10">
        <h1 className="
          text-3xl md:text-4xl font-semibold mb-10
          text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]
        ">
          Favourite Books
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {fav.map((items, i) => (
            <BookCard key={i} data={items} favourite={true} />
          ))}
        </div>

        {/* Empty State */}
        {fav.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h1 className="text-4xl font-semibold text-zinc-300">
              No Favourite Books Yet ✨
            </h1>
            <p className="text-zinc-400 mt-3">
              Start adding books you love
            </p>
            <img
              src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
              alt="star"
              className="h-20 my-8 opacity-60"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Favourite
