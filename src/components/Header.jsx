import React from "react";

// Header shown on every page — logo, teacher name, logout button
export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-50">

      {/* Left side: logo icon + app name */}
      <div className="flex items-center gap-3">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="10" fill="#00bea3" />
          <path
            d="M16 8C13 8 10 10.5 10 14C10 17 12 19 14 20.5V24H18V20.5C20 19 22 17 22 14C22 10.5 19 8 16 8Z"
            fill="white" opacity="0.9"
          />
        </svg>
        <div>
          <div className="text-base font-bold text-gray-800">Little Dreamers</div>
          <div className="text-xs text-gray-400">Daycare Management Dashboard</div>
        </div>
      </div>

      {/* Right side: bell, teacher info, avatar, logout */}
      <div className="flex items-center gap-4">

        {/* Bell icon with red dot to indicate unread alerts */}
        <div className="relative cursor-pointer text-xl">
          <span>🔔</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </div>

        {/* Teacher name and role */}
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-800">Ms. Sarah</span>
          <span className="text-xs text-gray-400">Class Teacher</span>
        </div>

        {/* Avatar circle */}
        <div className="w-9 h-9 rounded-full bg-[#00bea3] text-white flex items-center justify-center font-bold text-sm">
          S
        </div>

        <button className="text-sm text-gray-400 bg-transparent border-none cursor-pointer">
          ↪ Logout
        </button>
      </div>
    </header>
  );
}