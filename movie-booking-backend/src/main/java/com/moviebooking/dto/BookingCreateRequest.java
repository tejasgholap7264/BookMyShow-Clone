package com.moviebooking.dto;

import java.util.List;

import com.moviebooking.models.Seat;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for booking creation requests.
 * 
 * <p>This DTO contains all the information required to create a new booking
 * including the showtime, selected seats, and total amount.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Booking creation request")
public class BookingCreateRequest {
    
    /**
     * ID of the showtime for which the booking is being made.
     */
    @NotBlank
    @Schema(description = "Showtime ID", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
    private String showtimeId;
    
    /**
     * List of seats to be booked.
     */
    @NotEmpty
    @Schema(description = "List of seats to book", required = true)
    private List<Seat> seats;
    
    /**
     * Total amount for the booking.
     */
    @Positive
    @Schema(description = "Total amount for the booking", example = "25.00", required = true)
    private Double totalAmount;
}

// Response DTOs
