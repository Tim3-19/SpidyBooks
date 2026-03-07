import React from 'react'
import Hero from '../componenets/Home/Hero'
import Recent from '../componenets/Home/Recent'
import background from '../photos/bg.jpg'
const Home = () => {
  
    return <div className='bg-zinc-800 text-white px-10 py-8'
    style={{ backgroundImage: `url(${background})` }}>
        
        <Hero/>
        <Recent/>
    </div>
  
}
    
export default Home