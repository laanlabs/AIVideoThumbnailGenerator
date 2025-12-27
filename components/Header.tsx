
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-slate-800">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-wand-magic-sparkles text-white text-xl"></i>
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Thumb<span className="gradient-text">Style</span> AI
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition">Explore</a>
          <a href="#" className="hover:text-white transition">My Designs</a>
          <a href="#" className="hover:text-white transition">Tutorials</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
