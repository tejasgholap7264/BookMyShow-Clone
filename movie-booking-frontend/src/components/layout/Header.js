import React, { useState } from 'react';
import { CONFIG } from '../../constants/config';

const Header = ({ user, onNavigate, onLogout, onFetchBookings, onAdminNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (page) => {
    setIsMobileMenuOpen(false);
    onNavigate(page);
  };

  const handleAdminNavigation = (page) => {
    setIsMobileMenuOpen(false);
    onAdminNavigate(page);
  };

  const handleFetchBookings = () => {
    setIsMobileMenuOpen(false);
    onFetchBookings();
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    onLogout();
  };

  return (
    <>
      <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-40 safe-area-top">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <h1 
              className="text-xl sm:text-2xl font-bold cursor-pointer hover:text-red-500 transition-colors touch-button"
              onClick={() => handleNavigation(CONFIG.PAGES.HOME)}
            >
              🎬 MovieBook
            </h1>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <button 
                onClick={() => handleNavigation(CONFIG.PAGES.HOME)}
                className="hover:text-red-500 transition-colors touch-button px-3 py-2"
              >
                Home
              </button>
              
              {user ? (
                <>
                  <button 
                    onClick={handleFetchBookings}
                    className="hover:text-red-500 transition-colors touch-button px-3 py-2"
                  >
                    My Bookings
                  </button>
                  
                  {user.role === 'ADMIN' && (
                    <div className="relative group">
                      <button className="hover:text-red-500 transition-colors touch-button px-3 py-2 flex items-center">
                        Admin
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Admin Dropdown */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <button 
                          onClick={() => handleAdminNavigation(CONFIG.PAGES.ADMIN_THEATRES)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Theatres
                        </button>
                        <button 
                          onClick={() => handleAdminNavigation(CONFIG.PAGES.ADMIN_SHOWTIMES)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Showtimes
                        </button>
                        <button 
                          onClick={() => handleAdminNavigation(CONFIG.PAGES.ADMIN_MOVIES)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Movies
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm hidden lg:block">Welcome, {user.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700 transition-colors touch-button text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => handleNavigation(CONFIG.PAGES.LOGIN)}
                    className="hover:text-red-500 transition-colors touch-button px-3 py-2"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => handleNavigation(CONFIG.PAGES.REGISTER)}
                    className="bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700 transition-colors touch-button text-sm"
                  >
                    Register
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden touch-button p-2 rounded-md hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        />
        
        {/* Menu Content */}
        <div className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="touch-button p-2 rounded-md hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
              <button 
                onClick={() => handleNavigation(CONFIG.PAGES.HOME)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors touch-button"
              >
                🏠 Home
              </button>
              
              {user ? (
                <>
                  <button 
                    onClick={handleFetchBookings}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors touch-button"
                  >
                    🎫 My Bookings
                  </button>
                  
                  {user.role === 'ADMIN' && (
                    <>
                      <div className="px-4 py-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Admin Panel
                      </div>
                      <button 
                        onClick={() => handleAdminNavigation(CONFIG.PAGES.ADMIN_THEATRES)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors touch-button"
                      >
                        🏢 Manage Theatres
                      </button>
                      <button 
                        onClick={() => handleAdminNavigation(CONFIG.PAGES.ADMIN_SHOWTIMES)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors touch-button"
                      >
                        🕒 Manage Showtimes
                      </button>
                      <button 
                        onClick={() => handleAdminNavigation(CONFIG.PAGES.ADMIN_MOVIES)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors touch-button"
                      >
                        🎬 Manage Movies
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleNavigation(CONFIG.PAGES.LOGIN)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors touch-button"
                  >
                    🔐 Login
                  </button>
                  <button 
                    onClick={() => handleNavigation(CONFIG.PAGES.REGISTER)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors touch-button"
                  >
                    📝 Register
                  </button>
                </>
              )}
            </nav>

            {/* User Info & Logout */}
            {user && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Welcome, {user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors touch-button text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header; 