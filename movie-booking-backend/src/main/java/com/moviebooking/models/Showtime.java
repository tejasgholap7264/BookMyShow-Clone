package com.moviebooking.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Showtime entity representing a movie screening at a specific theatre.
 * 
 * <p>This entity links a movie to a theatre with a specific date and time,
 * along with pricing and seat availability information.</p>
 * 
 * <p>Showtimes are the core entities that enable the booking process,
 * as users book seats for specific showtimes.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "showtimes")
public class Showtime {
    
    /**
     * Unique identifier for the showtime.
     * Auto-generated UUID when a new showtime is created.
     */
    @Id
    private String id;
    
    /**
     * Reference to the movie being screened.
     * Links to the Movie entity.
     */
    @NotBlank
    private String movieId;
    
    /**
     * Reference to the theatre where the movie is being screened.
     * Links to the Theatre entity.
     */
    @NotBlank
    private String theatreId;
    
    /**
     * Date and time when the movie will be screened.
     */
    @NotNull
    private LocalDateTime showDate;
    
    /**
     * Price per seat for this showtime.
     */
    @Positive
    private Double price;
    
    /**
     * Number of available seats for this showtime.
     * Decreases as bookings are made.
     */
    @PositiveOrZero
    private Integer availableSeats;
    
    /**
     * Timestamp when the showtime was created.
     * Auto-generated when a new showtime is saved.
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Pre-persist method to generate UUID if not set.
     * This ensures every showtime has a unique identifier.
     */
    public void generateIdIfNotSet() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
    
    /**
     * Checks if the showtime has available seats.
     * 
     * @return true if there are available seats, false otherwise
     */
    public boolean hasAvailableSeats() {
        return this.availableSeats != null && this.availableSeats > 0;
    }
    
    /**
     * Decreases the available seats count by the specified number.
     * 
     * @param seatsToBook the number of seats being booked
     * @throws IllegalArgumentException if trying to book more seats than available
     */
    public void bookSeats(int seatsToBook) {
        if (this.availableSeats < seatsToBook) {
            throw new IllegalArgumentException("Not enough available seats");
        }
        this.availableSeats -= seatsToBook;
    }
} 

