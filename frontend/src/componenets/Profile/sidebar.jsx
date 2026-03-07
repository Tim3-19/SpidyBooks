import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = ({ data }) => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path;

  const navItem = (to, label, Icon, activeColor) => (
    <Link
      to={to}
      className={`
        flex items-center gap-4 px-4 py-3 rounded-xl
        text-sm font-medium
        transition-all duration-300
        ${
          isActive(to)
            ? "bg-zinc-900 text-white shadow-inner"
            : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
        }
      `}
    >
      <Icon
        className={`text-base ${
          isActive(to)
            ? activeColor
            : "text-zinc-500 group-hover:text-white"
        }`}
      />
      {label}
    </Link>
  );

  return (
    <div className="
      bg-zinc-900/70 backdrop-blur-xl
      border border-zinc-800
      rounded-2xl
      p-6
      h-full
      flex flex-col
      shadow-[0_30px_80px_rgba(0,0,0,0.6)]
    ">
      {/* -------- Profile -------- */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl"></div>

          <img
            src={data.avatar}
            alt="avatar"
            className="
              relative
              h-24 w-24
              rounded-full
              object-cover
              ring-2 ring-zinc-700
              shadow-xl
            "
          />
        </div>

        <p className="mt-4 text-lg font-semibold text-zinc-100">
          {data.username}
        </p>

        <p className="text-xs text-zinc-400 mt-1 truncate w-full">
          {data.email}
        </p>

        <div className="w-full h-px bg-zinc-800 my-6"></div>
      </div>

      {/* -------- Navigation -------- */}
      <div className="flex flex-col gap-2">
        {navItem("/profile", "Favourites", FaHeart, "text-red-500")}
        {navItem("/profile/orderHistory", "Order History", FaHistory, "text-blue-400")}
        {navItem("/profile/settings", "Settings", FaCog, "text-emerald-400")}
      </div>

      {/* -------- Logout -------- */}
      <button
        className="
          mt-auto
          flex items-center justify-center gap-3
          py-3 rounded-xl
          text-sm font-semibold
          text-zinc-300
          bg-zinc-800/60
          hover:bg-red-500/10 hover:text-red-500
          border border-zinc-800 hover:border-red-500/40
          transition-all duration-300
        "
      >
        Log Out
        <FaSignOutAlt className="text-sm" />
      </button>
    </div>
  );
};

export default Sidebar;
