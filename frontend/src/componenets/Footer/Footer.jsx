import React from 'react'

const Footer = () => {
  return (
    <footer className=" bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 text-zinc-300 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="SpidyBooks logo"
            className="h-8 w-8 object-contain opacity-90"
          />
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">
              SpidyBooks
            </h1>
            <p className="text-xs text-zinc-400">
              Crafted for book lovers & curious minds.
            </p>
          </div>
        </div>

        <p className="text-xs md:text-sm text-zinc-500 text-center md:text-right">
          &copy; {new Date().getFullYear()} SpidyBooks. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer