import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Loader from '../Loader/Loader'
const Settings = () => {
  const [Values,setValue] = useState({address: ""})
  cons [ProfileData, setProfileData] = useState()
  const headers={
    id:localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")},`
  }
    useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/get-information",
          { headers }
        )
        setfav(response.data.data)
      } catch (error) {
        console.error("Error fetching:", error)
      }
      setProfileData(response.data);
      setValue({address: response.data.address});
    }
    fetch()
  },[])
    
  return (
    <>
    {!ProfileData && (
      <div className='w-full h-[100%] flex items-center justify-center'>
        <Loader/>
      </div>
    )}
    {ProfileDaa && (
      <div className='h-[100%] p-0 md:p-4 text-zinc-100'>
        <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
          Settings
        </h1>
        <div className='flex gap-12'>
          <div className=''>
            <label htmflFor="">Username</label>
            <p className='p-2 rounded bg-zinc-800 mt-2 font-semibold'>
              {ProfileData.name}
            </p>
          </div>
          <div className=''>
            <label htmlFor="">Email</label>
            <p className='p- rounded bg-zinc-800 mt-2 font-semibold'>
              {ProfileData.email}
            </p>
          </div>
        </div>
        <div className='mt-4 flex flex-col'>
          <label htmlFor="">Address</label>
          <textarea className='p-2 rounded bg-zinc-800 mt-2 font-semibold'
          rows="5"
          placeholder='address'
          name="address"
          value = {Values.address}/>

          
        </div>
        <div className='mt-4 flex justify-end'>
          <button className='bg-yellow-500 text-zinc-900 font-semibold px-3 py-2 rounded'>
            update
          </button>
        </div>
      </div>
    )}
    </>
  )
}

export default Settings