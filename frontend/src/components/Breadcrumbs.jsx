import React from "react";

export default function Breadcrumbs({ items = ["Start", "all contents", "Glossary"] }) {
  return (
    <nav className="bg-slate-950 py-3 border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-1 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              <span
                className={
                  index === items.length - 1
                    ? "text-slate-100 font-medium"
                    : "hover:text-white cursor-pointer"
                }
              >
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
