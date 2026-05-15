import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Hero from '../componenets/Home/Hero'
import Recent from '../componenets/Home/Recent'
import FloatingBackground from '../componenets/Home/FloatingBackground'

const Home = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
    return (
    <div className='relative min-h-screen'>
        {/* Dynamic Background */}
        <FloatingBackground />
        
        {/* Main Content (z-index ensures it sits above the background) */}
        <div className='relative z-10 text-white px-10 py-8'>
            <Hero/>
            
            {!isLoggedIn && (
                <div className="mt-20 mb-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-yellow-100 mb-12">Why SpidyBooks?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-zinc-800/40 p-8 rounded-2xl border border-zinc-700/50 backdrop-blur-md hover:bg-zinc-800/60 transition-all duration-300">
                            <div className="text-5xl mb-6"></div>
                            <h3 className="text-xl font-semibold mb-3 text-white">Personalized Recommendations</h3>
                            <p className="text-zinc-400">Discover books tailored specifically to your taste and reading history.</p>
                        </div>
                        <div className="bg-zinc-800/40 p-8 rounded-2xl border border-zinc-700/50 backdrop-blur-md hover:bg-zinc-800/60 transition-all duration-300">
                            <div className="text-5xl mb-6"></div>
                            <h3 className="text-xl font-semibold mb-3 text-white">Easy Book Shopping</h3>
                            <p className="text-zinc-400">A seamless, intuitive experience to find and purchase your next read.</p>
                        </div>
                        <div className="bg-zinc-800/40 p-8 rounded-2xl border border-zinc-700/50 backdrop-blur-md hover:bg-zinc-800/60 transition-all duration-300">
                            <div className="text-5xl mb-6"></div>
                            <h3 className="text-xl font-semibold mb-3 text-white">Discover Books Worldwide</h3>
                            <p className="text-zinc-400">Access a global library of stories, knowledge, and diverse perspectives.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative mt-16">
                <Recent/>
                
                {!isLoggedIn && (
                    <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl mt-8">
                        <div className="bg-zinc-800/90 p-10 rounded-3xl border border-zinc-700/50 text-center shadow-2xl transform transition-transform hover:scale-105 max-w-md mx-4">
                            <span className="text-6xl mb-6 block">🔒</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Sign in to explore full collection</h3>
                            <p className="text-zinc-400 mb-8">Join our community to discover thousands of amazing books and personalized recommendations.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/logIn" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-lg shadow-blue-500/20">
                                    Log In
                                </Link>
                                <Link to="/signUp" className="px-8 py-3 border border-zinc-500 hover:border-zinc-300 text-zinc-300 hover:text-white rounded-full font-semibold transition-all">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
    )
}
    
export default Home