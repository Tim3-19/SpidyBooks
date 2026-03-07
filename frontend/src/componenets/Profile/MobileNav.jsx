import React from "react";
import { Link } from "react-router-dom";
const MobileNav = ({ active }) => {
    return (
        <div className="w-full flex items-center justify-between mt-4">
            <Link 
            to = "/profile"
            className="text-zinc-100 font-semibold w-full text-center hover:bg-zinc-900 rounded transistion-all duration-100">
                Favourites
            </Link>
            <Link
            to = "/profile/settings"
            className="text-zinc-100 font-semibold w-full text-center hover:bg-zinc-900 rounded transistion-all duration-100">
                Settings
            </Link>
        </div>
    )
}

export default MobileNav;