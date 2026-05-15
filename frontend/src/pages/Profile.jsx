import React, { useEffect,useState } from 'react'
import Sidebar from "../componenets/Profile/sidebar"
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from "axios";
import Loader from '../componenets/Loader/Loader';


const Profile = () => {
   //const isLoggedIn = useSelector();
   const [Profiledata, setProfiledata] = useState();
   const headers = {
    id:localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
   }
   useEffect(() => {
     const fetch = async () =>{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/get-information`,{headers})
        setProfiledata(response.data)

     };
     fetch();
    }, [])
   
  return (
    <div className='bg-zinc-900 px-2 md:px-2 flex flex-col md:flex-row x py-8'>
  {!Profiledata && <div className='w-full h-full flex items-center justify-center'>
    <Loader/> 
    </div>}
  {Profiledata &&  <>
    <div className='w-full md:w-1/6 h-screen'>
        <Sidebar data= {Profiledata}/>
    </div>
    <div className='w-full md:w-5/6'>
        <Outlet />
    </div>
    </>}

</div>


)
}

export default Profile