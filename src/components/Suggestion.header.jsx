import React from 'react';

function SuggestionHeader() {
  return (
    <header>
      <nav className="container mx-auto flex justify-between items-center bg-gradient-to-r from-teal-800  to-blue-500 py-2 px-4 shadow-md">
        
        {/* Logo */}
        <div className="font-extrabold text-2xl bg-gradient-to-r from-teal-500 via-blue-400 to-pink-500 text-transparent bg-clip-text tracking-wide">
          TripMate
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-6 text-lg font-semibold">
          <li>
            <a href="/" className="text-blue-400 hover:text-blue-500 transition">
              Home
            </a>
          </li>
          <li>
            <a href="#Destination" className="text-teal-400 hover:text-blue-400 transition">
              Top Destinations
            </a>
          </li>
          <li>
            <a href="#Contact" className="text-teal-400 hover:text-blue-500 transition">
              Contact
            </a>
          </li>
        </ul>

        {/* Log Out Button */}
        <a
          href="/login"
          aria-label="Log out"
          className="bg-red-500 hover:bg-red-600 active:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
        >
          Log Out
        </a>
      </nav>
    </header>
  );
}

export default SuggestionHeader;