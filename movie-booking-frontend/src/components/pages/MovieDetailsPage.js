import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const MovieDetailsPage = ({ 
  selectedMovie, 
  showtimes, 
  theatres, 
  loading, 
  error, 
  onNavigate, 
  onSelectShowtime, 
  onRetry 
}) => {
  if (!selectedMovie) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-600 mb-4 text-lg">No movie selected</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors touch-button"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <LoadingSpinner size="xl" text="Loading showtimes..." />
      </div>
    );
  }

  // Debug logging
  console.log('theatres:', theatres);
  console.log('showtimes:', showtimes);

  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const theatre = theatres.find(t => String(t.id).trim() === String(showtime.theatreId).trim());
    const theatreName = theatre ? theatre.name : 'Unknown Theatre';
    
    if (!acc[theatreName]) {
      acc[theatreName] = [];
    }
    acc[theatreName].push(showtime);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('home')}
          className="mb-4 sm:mb-6 text-red-600 hover:text-red-800 flex items-center touch-button"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Movies
        </button>
        
        <ErrorMessage 
          message={error} 
          onRetry={onRetry}
        />
        
        {/* Movie Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="relative group">
                <img 
                  src={selectedMovie.posterUrl} 
                  alt={selectedMovie.title}
                  className="w-full rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
          
          {/* Movie Info and Showtimes */}
          <div className="lg:col-span-2">
            {/* Movie Header */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {selectedMovie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-lg sm:text-xl">⭐</span>
                  <span className="text-gray-600 ml-2 text-base sm:text-lg font-medium">
                    {selectedMovie.rating}/10
                  </span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm sm:text-base">{selectedMovie.duration} min</span>
                </div>
                
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedMovie.genre}
                </span>
                
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedMovie.language}
                </span>
              </div>
              
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {selectedMovie.description}
              </p>
            </div>
            
            {/* Showtimes Section */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Select Showtime
              </h2>
              
              {Object.keys(groupedShowtimes).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎭</div>
                  <p className="text-gray-600 mb-4 text-lg">No showtimes available for this movie</p>
                  <button
                    onClick={() => onNavigate('home')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors touch-button"
                  >
                    Browse Other Movies
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedShowtimes).map(([theatreName, theatreShowtimes]) => (
                    <div key={theatreName} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {theatreName}
                      </h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {theatreShowtimes.map((showtime) => (
                          <button
                            key={showtime.id}
                            onClick={() => onSelectShowtime(showtime)}
                            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 touch-button"
                          >
                            <div className="font-semibold text-sm sm:text-base">
                              {new Date(showtime.showDate).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </div>
                            <div className="text-xs sm:text-sm opacity-90 mt-1">
                              ₹{showtime.price}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage; 