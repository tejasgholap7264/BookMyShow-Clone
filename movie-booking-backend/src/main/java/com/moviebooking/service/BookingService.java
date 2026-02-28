package com.moviebooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviebooking.dto.BookingCreateRequest;
import com.moviebooking.exception.BadRequestException;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.models.Booking;
import com.moviebooking.models.Seat;
import com.moviebooking.models.Showtime;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.ShowtimeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service class for managing booking operations in the movie booking system.
 * 
 * <p>This service handles all booking-related business logic including:</p>
 * <ul>
 *   <li>Creating new bookings</li>
 *   <li>Validating seat availability</li>
 *   <li>Updating seat counts</li>
 *   <li>Retrieving user booking history</li>
 * </ul>
 * 
 * <p>The service ensures data consistency by using transactional operations
 * and proper validation to prevent double bookings.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final ShowtimeRepository showtimeRepository;
    
    /**
     * Creates a new booking for a user.
     * 
     * <p>This method performs the following validations:</p>
     * <ul>
     *   <li>Verifies the showtime exists</li>
     *   <li>Checks seat availability</li>
     *   <li>Validates that seats are not already booked</li>
     *   <li>Updates the available seat count</li>
     * </ul>
     * 
     * @param request the booking creation request containing showtime and seat details
     * @param userId the ID of the user making the booking
     * @return the created booking entity
     * @throws ResourceNotFoundException if the showtime is not found
     * @throws BadRequestException if seats are already booked or invalid
     */
    public Booking createBooking(BookingCreateRequest request, String userId) {
        log.info("Creating booking for user: {} and showtime: {}", userId, request.getShowtimeId());
        
        // Validate showtime exists
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));
        
        // Check if showtime has enough available seats
        if (!showtime.hasAvailableSeats() || showtime.getAvailableSeats() < request.getSeats().size()) {
            throw new BadRequestException("Not enough available seats for this showtime");
        }
        
        // Check seat availability by looking at existing bookings
        List<Booking> existingBookings = bookingRepository.findByShowtimeId(request.getShowtimeId());
        List<Seat> bookedSeats = new ArrayList<>();
        existingBookings.forEach(booking -> bookedSeats.addAll(booking.getSeats()));
        
        // Validate that requested seats are not already booked
        for (Seat newSeat : request.getSeats()) {
            for (Seat bookedSeat : bookedSeats) {
                if (bookedSeat.getRow().equals(newSeat.getRow()) && 
                    bookedSeat.getNumber().equals(newSeat.getNumber())) {
                    throw new BadRequestException("Seat " + newSeat.getSeatIdentifier() + " is already booked");
                }
            }
        }
        
        // Create the booking
        Booking booking = Booking.builder()
                .userId(userId)
                .showtimeId(request.getShowtimeId())
                .seats(request.getSeats())
                .totalAmount(request.getTotalAmount())
                .build();
        
        // Generate ID for the booking
        booking.generateIdIfNotSet();
        
        // Save the booking
        bookingRepository.save(booking);
        
        // Update available seats count
        try {
            showtime.bookSeats(request.getSeats().size());
            showtimeRepository.save(showtime);
        } catch (IllegalArgumentException e) {
            // Rollback booking if seat update fails
            bookingRepository.delete(booking);
            throw new BadRequestException("Failed to update seat availability: " + e.getMessage());
        }
        
        log.info("Successfully created booking: {} for user: {}", booking.getId(), userId);
        return booking;
    }
    
    /**
     * Retrieves all bookings for a specific user.
     * 
     * @param userId the ID of the user whose bookings to retrieve
     * @return list of bookings for the user
     */
    public List<Booking> getUserBookings(String userId) {
        log.info("Retrieving bookings for user: {}", userId);
        return bookingRepository.findByUserId(userId);
    }
    
    /**
     * Retrieves a specific booking by its ID.
     * 
     * @param bookingId the ID of the booking to retrieve
     * @return the booking entity
     * @throws ResourceNotFoundException if the booking is not found
     */
    public Booking getBooking(String bookingId) {
        log.info("Retrieving booking: {}", bookingId);
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }
    
    /**
     * Cancels a booking and releases the seats.
     * 
     * @param bookingId the ID of the booking to cancel
     * @param userId the ID of the user requesting the cancellation
     * @return the cancelled booking
     * @throws ResourceNotFoundException if the booking is not found
     * @throws BadRequestException if the user is not authorized to cancel this booking
     */
    public Booking cancelBooking(String bookingId, String userId) {
        log.info("Cancelling booking: {} for user: {}", bookingId, userId);
        
        Booking booking = getBooking(bookingId);
        
        // Check if user owns this booking
        if (!booking.getUserId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }
        
        // Check if booking is already cancelled
        if (booking.isCancelled()) {
            throw new BadRequestException("Booking is already cancelled");
        }
        
        // Cancel the booking
        booking.cancel();
        bookingRepository.save(booking);
        
        // Release the seats back to available
        Showtime showtime = showtimeRepository.findById(booking.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));
        
        showtime.setAvailableSeats(showtime.getAvailableSeats() + booking.getNumberOfSeats());
        showtimeRepository.save(showtime);
        
        log.info("Successfully cancelled booking: {}", bookingId);
        return booking;
    }
}