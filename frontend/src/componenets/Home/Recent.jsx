import React, { useState, useEffect } from 'react';
import axios from 'axios'
import BookCard from "../BookCard/BookCard"
import Loader from '../Loader/Loader';
const Recent = () => {
  const [Rbook, setRbook] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async ()=> {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/recent-added");
        setRbook(response.data.data || []);
      } catch (err) {
        console.error(err);
        setRbook([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (

    <div className='mt-8 px-4'>
        <h4 className='text-3xl text-yellow-100'>Recently Added books</h4>
        {loading && (
          <div className='flex items-center justify-center my-8'>
             <Loader/>
          </div>)}
        <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {Rbook.map((items,i)=>(
            <div key = {i}>
              <BookCard data={items} />
            </div>))}
        </div>
    </div>
  )
}


export default Recent