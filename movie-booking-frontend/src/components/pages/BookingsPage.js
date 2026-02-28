import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const BookingsPage = ({ 
  bookings, 
  movies, 
  showtimes, 
  loading, 
  error, 
  onNavigate, 
  onRetry,
  onCancelBooking 
}) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <LoadingSpinner size="xl" text="Loading bookings..." />
      </div>
    );
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const result = await onCancelBooking(bookingId);
      if (result.success) {
        alert('Booking cancelled successfully!');
      } else {
        alert(result.error || 'Failed to cancel booking');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'cancelled':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '📋';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600">
            Manage your movie ticket bookings
          </p>
        </div>
        
        <ErrorMessage 
          message={error} 
          onRetry={onRetry}
        />
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 mb-6">You haven't made any bookings yet</p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors touch-button"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {bookings.map((booking) => {
              const movie = movies.find(m => {
                const showtime = showtimes.find(s => s.id === booking.showtimeId);
                return showtime && m.id === showtime.movieId;
              });
              
              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  {/* Booking Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getStatusIcon(booking.status)}</span>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                            {movie ? movie.title : 'Movie'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Booking ID: {booking.id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-bold text-gray-800">
                          ₹{booking.totalAmount}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Booking Details */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Seats */}
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Seats</p>
                          <p className="text-sm text-gray-600">
                            {booking.seats.map(s => `${s.row}${s.number}`).join(', ')}
                          </p>
                        </div>
                      </div>
                      
                      {/* Booking Date */}
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Booked On</p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.bookingDate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Showtime */}
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Showtime</p>
                          <p className="text-sm text-gray-600">
                            {(() => {
                              const showtime = showtimes.find(s => s.id === booking.showtimeId);
                              return showtime ? new Date(showtime.showDate).toLocaleString() : 'N/A';
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-3">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors touch-button text-sm font-medium flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Booking
                          </button>
                        )}
                        
                        <button
                          onClick={() => onNavigate('home')}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors touch-button text-sm font-medium flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Book More Movies
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage; 