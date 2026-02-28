import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { CONFIG } from '../../constants/config';

const HomePage = ({ movies, loading, error, onMovieSelect, onRetry }) => {

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <LoadingSpinner size="xl" text="Loading movies..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-red-900 to-purple-900 text-white py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-shadow-lg">
              Book Your Movie Experience
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Discover and book tickets for the latest movies
            </p>
            
            {/* Hero Image */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <img 
                  src="https://images.pexels.com/photos/375885/pexels-photo-375885.jpeg" 
                  alt="Cinema" 
                  className="rounded-lg shadow-2xl max-h-48 sm:max-h-56 md:max-h-64 lg:max-h-72 object-cover w-full max-w-md transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-400">100+</div>
                <div className="text-sm text-gray-300">Movies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-400">50+</div>
                <div className="text-sm text-gray-300">Theatres</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-400">24/7</div>
                <div className="text-sm text-gray-300">Booking</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-red-400">10K+</div>
                <div className="text-sm text-gray-300">Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movies Section */}
      <div className="container mx-auto py-8 sm:py-12 px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Now Showing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the latest blockbusters and book your tickets instantly
          </p>
        </div>
        
        <ErrorMessage 
          message={error} 
          onRetry={onRetry}
        />
        
        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 group overflow-hidden"
              onClick={() => onMovieSelect(movie)}
            >
              {/* Movie Poster */}
              <div className="relative overflow-hidden">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <span className="mr-1">⭐</span>
                  {movie.rating}
                </div>
                
                {/* Genre Badge */}
                <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {movie.genre}
                </div>
              </div>
              
              {/* Movie Info */}
              <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {movie.title}
                </h3>
                
                <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span>{movie.rating}/10</span>
                  </div>
                  <span className="text-gray-500">{movie.duration} min</span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">
                  {movie.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                    {movie.language}
                  </span>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700 transition-colors touch-button">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {movies.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Movies Available</h3>
            <p className="text-gray-600">Check back later for new releases!</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Why Choose MovieBook?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience seamless movie booking with our advanced features
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Booking</h3>
              <p className="text-gray-600 text-sm">Book tickets in just a few clicks</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💺</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Seat Selection</h3>
              <p className="text-gray-600 text-sm">Choose your preferred seats</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mobile Friendly</h3>
              <p className="text-gray-600 text-sm">Book from any device</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">Safe and secure transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 