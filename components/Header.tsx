
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-purple-500/10">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="text-2xl md:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          AniVerse
        </Link>
      </div>
    </header>
  );
};

export default Header;
