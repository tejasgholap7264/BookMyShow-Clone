package com.moviebooking.models;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Booking entity representing a user's seat reservation for a showtime.
 * 
 * <p>This entity tracks all the details of a booking including the user,
 * showtime, selected seats, total amount, and booking status.</p>
 * 
 * <p>Bookings are the core transaction entities that record when users
 * reserve seats for movie screenings.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "bookings")
public class Booking {
    
    /**
     * Unique identifier for the booking.
     * Auto-generated UUID when a new booking is created.
     */
    @Id
    private String id;
    
    /**
     * Reference to the user who made the booking.
     * Links to the User entity.
     */
    @NotBlank
    private String userId;
    
    /**
     * Reference to the showtime for which the booking was made.
     * Links to the Showtime entity.
     */
    @NotBlank
    private String showtimeId;
    
    /**
     * List of seats that were booked.
     * Contains seat details including row, number, and status.
     */
    @NotEmpty
    private List<Seat> seats;
    
    /**
     * Total amount paid for the booking.
     * Calculated as number of seats * price per seat.
     */
    @Positive
    private Double totalAmount;
    
    /**
     * Timestamp when the booking was created.
     * Auto-generated when a new booking is saved.
     */
    @Builder.Default
    private LocalDateTime bookingDate = LocalDateTime.now();
    
    /**
     * Current status of the booking.
     * Defaults to "confirmed" for new bookings.
     * Possible values: "confirmed", "cancelled", "completed"
     */
    @Builder.Default
    private String status = "confirmed";
    
    /**
     * Pre-persist method to generate UUID if not set.
     * This ensures every booking has a unique identifier.
     */
    public void generateIdIfNotSet() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
    
    /**
     * Gets the number of seats in this booking.
     * 
     * @return the number of seats booked
     */
    public int getNumberOfSeats() {
        return this.seats != null ? this.seats.size() : 0;
    }
    
    /**
     * Checks if the booking is confirmed.
     * 
     * @return true if the booking status is "confirmed", false otherwise
     */
    public boolean isConfirmed() {
        return "confirmed".equals(this.status);
    }
    
    /**
     * Checks if the booking is cancelled.
     * 
     * @return true if the booking status is "cancelled", false otherwise
     */
    public boolean isCancelled() {
        return "cancelled".equals(this.status);
    }
    
    /**
     * Cancels the booking by changing its status to "cancelled".
     */
    public void cancel() {
        this.status = "cancelled";
    }
}