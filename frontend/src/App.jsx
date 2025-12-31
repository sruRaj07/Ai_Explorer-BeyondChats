import React from "react";
import Navigation from "./components/Navigation";
import Breadcrumbs from "./components/Breadcrumbs";
import Articles from "./pages/Articles";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Navigation />
      <Breadcrumbs />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
        <Articles />
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm sm:text-base text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} BeyondChats AI Explorer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
