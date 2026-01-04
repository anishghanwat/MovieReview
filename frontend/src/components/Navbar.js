import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              🎬 MovieHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
            >
              Movies
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin/movies" 
                    className="px-4 py-2 text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10 rounded-lg transition-all duration-200 font-medium"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link 
                  to="/my-reviews" 
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
                >
                  My Reviews
                </Link>
                <Link 
                  to="/watchlist" 
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
                >
                  Watchlist
                </Link>
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
                  <span className="text-sm text-gray-400 hidden lg:block">
                    {user?.name || user?.email}
                  </span>
                  <button 
                    onClick={handleSignOut} 
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg ml-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            <Link 
              to="/" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Movies
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin/movies" 
                    className="block px-4 py-2 text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link 
                  to="/my-reviews" 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Reviews
                </Link>
                <Link 
                  to="/watchlist" 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Watchlist
                </Link>
                <div className="pt-4 border-t border-gray-700">
                  <div className="px-4 py-2 text-sm text-gray-400">
                    {user?.name || user?.email}
                  </div>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }} 
                    className="w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
