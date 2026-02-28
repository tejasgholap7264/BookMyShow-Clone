package com.moviebooking.enums;

/**
 * Enumeration representing the status of a seat in the theatre.
 * 
 * <p>Seat status tracks the current state of a seat during the booking process.
 * This helps prevent double bookings and provides real-time seat availability.</p>
 * 
 * <p>Status flow:</p>
 * <ul>
 *   <li><strong>AVAILABLE</strong>: Seat is free and can be booked</li>
 *   <li><strong>SELECTED</strong>: Seat is temporarily reserved (e.g., in shopping cart)</li>
 *   <li><strong>BOOKED</strong>: Seat has been permanently booked by a user</li>
 * </ul>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
public enum SeatStatus {
    
    /**
     * Seat is available for booking.
     * This is the default status for all seats when a showtime is created.
     */
    AVAILABLE,
    
    /**
     * Seat is temporarily selected/reserved.
     * This status is used when a user has the seat in their cart but hasn't
     * completed the booking yet. Seats in this status should be released
     * after a timeout period if not booked.
     */
    SELECTED,
    
    /**
     * Seat has been permanently booked.
     * This status indicates that a user has successfully booked this seat
     * and it cannot be booked by other users.
     */
    BOOKED
}