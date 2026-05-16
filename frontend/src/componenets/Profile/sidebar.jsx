import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaHistory,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';

// Inside your component:
const Sidebar = ({ data }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

const handleLogout = () => {
  // 1. Clear all session data
  // Clear authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  // Dispatch logout action
  dispatch(authActions.logout());
  
  // 2. If you use Redux, dispatch your logout action here:
  // dispatch(authActions.logout());

  // 3. Redirect to login page and replace history entry
  navigate("/logIn", { replace: true });
};

  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path;

  const navItem = (
    to,
    label,
    Icon,
    activeColor
  ) => (

    <Link
      to={to}
      className={`
        group
        relative
        overflow-hidden
        flex items-center gap-4
        px-5 py-4
        rounded-2xl
        text-sm font-medium
        transition-all duration-300
        border

        ${
          isActive(to)
            ? `
              bg-zinc-900/90
              border-zinc-700
              text-white
              shadow-[0_0_25px_rgba(255,255,255,0.04)]
            `
            : `
              border-transparent
              text-zinc-400
              hover:text-white
              hover:bg-zinc-900/60
              hover:border-zinc-800
            `
        }
      `}
    >

      {/* Active Glow */}
      {isActive(to) && (
        <div className="
          absolute
          inset-0
          bg-gradient-to-r
          from-indigo-500/10
          to-transparent
          pointer-events-none
        " />
      )}

      {/* Icon */}
      <div className="
        relative z-10
        transition-transform duration-300
        group-hover:scale-110
      ">
        <Icon
          className={`
            text-base
            ${
              isActive(to)
                ? activeColor
                : "text-zinc-500 group-hover:text-white"
            }
          `}
        />
      </div>

      {/* Label */}
      <span className="relative z-10">
        {label}
      </span>

      {/* Active Side Bar */}
      {isActive(to) && (
        <div className="
          absolute
          left-0
          top-3
          bottom-3
          w-1
          rounded-full
          bg-indigo-400
        " />
      )}

    </Link>
  );

  return (

    <div className="
      relative
      overflow-hidden

      bg-zinc-900/60
      backdrop-blur-2xl

      border border-zinc-800/80

      rounded-3xl
      p-7

      h-full
      flex flex-col

      shadow-[0_30px_100px_rgba(0,0,0,0.7)]
    ">

      {/* Background Glow */}
      <div className="
        absolute
        -top-20
        -right-20
        h-40
        w-40
        rounded-full
        bg-indigo-500/10
        blur-3xl
      " />

      {/* -------- Profile -------- */}
      <div className="
        relative
        flex flex-col
        items-center
        text-center
      ">

        {/* Avatar Wrapper */}
        <div className="relative group">

          {/* Outer Glow */}
          <div className="
            absolute
            inset-0
            rounded-full
            bg-indigo-500/20
            blur-2xl
            scale-110
            group-hover:scale-125
            transition-all duration-500
          " />

          {/* Avatar Ring */}
          <div className="
            relative
            p-[3px]
            rounded-full
            bg-gradient-to-br
            from-indigo-400/70
            via-zinc-700
            to-zinc-900
          ">

            <img
              src={data.avatar}
              alt="avatar"
              className="
                h-24 w-24
                rounded-full
                object-cover
                bg-zinc-950
              "
            />

          </div>
        </div>

        {/* Username */}
        <p className="
          mt-5
          text-xl
          font-semibold
          text-zinc-100
          tracking-wide
        ">
          {data.username}
        </p>

        {/* Email */}
        <p className="
          text-xs
          text-zinc-500
          mt-1
          truncate
          max-w-[220px]
        ">
          {data.email}
        </p>

        {/* Divider */}
        <div className="
          w-full
          h-px
          bg-gradient-to-r
          from-transparent
          via-zinc-700
          to-transparent
          my-7
        " />
      </div>

      {/* -------- Navigation -------- */}
      <div className="flex flex-col gap-3">

        {navItem(
          "/profile",
          "Favourites",
          FaHeart,
          "text-red-500"
        )}

        {navItem(
          "/profile/orderHistory",
          "Order History",
          FaHistory,
          "text-blue-400"
        )}

        {navItem(
          "/profile/settings",
          "Settings",
          FaCog,
          "text-emerald-400"
        )}

      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* -------- Logout -------- */}
        <button
        onClick={handleLogout}
        className="
          group
          mt-8

          flex items-center justify-center gap-3

          py-4 rounded-2xl

          text-sm font-semibold

          text-zinc-300

          bg-zinc-800/60

          border border-zinc-800

          hover:bg-red-500/10
          hover:text-red-400
          hover:border-red-500/40

          transition-all duration-300
        "
      >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">
          Log Out
        </span>
        <FaSignOutAlt
          className="
            text-sm
            transition-transform duration-300
            group-hover:translate-x-1
          "
        />
      </button>

    </div>
  );
};

export default Sidebar;