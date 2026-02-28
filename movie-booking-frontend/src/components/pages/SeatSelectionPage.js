import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const SeatSelectionPage = ({ 
  selectedMovie, 
  selectedShowtime, 
  seats, 
  selectedSeats, 
  loading, 
  error, 
  onNavigate, 
  onToggleSeat, 
  onBookTickets, 
  onRetry 
}) => {
  if (!selectedMovie || !selectedShowtime) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-600 mb-4 text-lg">No movie or showtime selected</p>
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
        <LoadingSpinner size="xl" text="Loading seats..." />
      </div>
    );
  }

  const rows = [...new Set(seats.map(seat => seat.row))].sort();
  const seatsPerRow = Math.max(...seats.map(seat => seat.number));
  
  const getSeat = (row, number) => {
    return seats.find(seat => seat.row === row && seat.number === number);
  };

  const isSeatSelected = (seat) => {
    return selectedSeats.some(s => s.row === seat.row && s.number === seat.number);
  };

  const handleBookTickets = async () => {
    const result = await onBookTickets();
    if (result.success) {
      alert(`Booking confirmed! Total: ₹${result.totalAmount}`);
      onNavigate('bookings');
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('movie-details')}
          className="mb-4 sm:mb-6 text-red-600 hover:text-red-800 flex items-center touch-button"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Showtimes
        </button>
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Select Your Seats
          </h1>
          <div className="bg-white rounded-lg p-4 shadow-md max-w-md mx-auto">
            <p className="text-gray-600 font-medium mb-1">
              {selectedMovie.title}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(selectedShowtime.showDate).toLocaleDateString()} • {new Date(selectedShowtime.showDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
            <p className="text-sm text-gray-500">
              {selectedShowtime.theatreName}
            </p>
          </div>
        </div>

        <ErrorMessage 
          message={error} 
          onRetry={onRetry}
        />

        {/* Screen */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 mx-auto py-3 px-6 sm:px-8 rounded-t-full max-w-xs sm:max-w-md shadow-inner">
            <span className="text-gray-600 font-semibold text-sm sm:text-base">SCREEN</span>
          </div>
        </div>

        {/* Seat Map Container */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg max-w-4xl mx-auto overflow-x-auto">
          {/* Seat Map */}
          <div className="space-y-2 sm:space-y-4 min-w-max">
            {rows.map(row => (
              <div key={row} className="flex justify-center items-center space-x-1 sm:space-x-2">
                {/* Row Label */}
                <span className="w-6 sm:w-8 text-center font-semibold text-gray-600 text-xs sm:text-sm">
                  {row}
                </span>
                
                {/* Seats */}
                {Array.from({ length: seatsPerRow }, (_, index) => {
                  const seatNumber = index + 1;
                  const seat = getSeat(row, seatNumber);
                  const isSelected = seat && isSeatSelected(seat);
                  
                  if (!seat) {
                    return <div key={seatNumber} className="w-6 h-6 sm:w-8 sm:h-8"></div>;
                  }

                  return (
                    <button
                      key={`${row}${seatNumber}`}
                      onClick={() => onToggleSeat(seat)}
                      disabled={seat.status === 'booked'}
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded text-xs font-semibold transition-all duration-200 touch-button ${
                        seat.status === 'booked'
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : isSelected
                          ? 'bg-green-500 text-white shadow-lg scale-110'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                      }`}
                      title={`Seat ${row}${seatNumber}`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6 sm:mt-8 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        {selectedSeats.length > 0 && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md mx-auto mt-6 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Booking Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected Seats:</span>
                <span className="font-medium">
                  {selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price per ticket:</span>
                <span className="font-medium">₹{selectedShowtime.price}</span>
              </div>
              
              <div className="flex justify-between items-center text-lg font-semibold border-t pt-3">
                <span>Total Amount:</span>
                <span className="text-red-600">₹{selectedSeats.length * selectedShowtime.price}</span>
              </div>
            </div>
            
            <button
              onClick={handleBookTickets}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 sm:py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed touch-button text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Booking...
                </div>
              ) : (
                `Book ${selectedSeats.length} Ticket${selectedSeats.length > 1 ? 's' : ''}`
              )}
            </button>
          </div>
        )}

        {/* No Seats Selected Message */}
        {selectedSeats.length === 0 && (
          <div className="text-center mt-6 sm:mt-8">
            <div className="text-4xl mb-2">💺</div>
            <p className="text-gray-600">Select your seats to continue with booking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelectionPage; 