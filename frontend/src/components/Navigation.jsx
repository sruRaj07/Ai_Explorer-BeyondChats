import React from "react";

export default function Navigation() {
  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Title */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              BC
            </div> */}
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
                BeyondChats AI Explorer
              </span>
              {/* <span className="text-[11px] sm:text-xs text-slate-400">
                Curated AI-enhanced healthcare articles
              </span> */}
            </div>
          </div>

          {/* Right: Simple nav links (no search) */}
          {/* <div className="hidden sm:flex items-center space-x-6 text-sm font-medium">
            <button className="text-slate-200 hover:text-white transition-colors">
              Home
            </button>
            <button className="text-slate-300 hover:text-white transition-colors">
              Articles
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              About
            </button>
          </div> */}
        </div>
      </div>
    </nav>
  );
}
