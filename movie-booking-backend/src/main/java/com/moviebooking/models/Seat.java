package com.moviebooking.models;

import com.moviebooking.enums.SeatStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Seat entity representing a seat in a theatre.
 * 
 * <p>This entity defines the position and status of a seat within a theatre.
 * Seats are identified by their row and number, and can have different
 * statuses (AVAILABLE, SELECTED, BOOKED).</p>
 * 
 * <p>Seats are used in the booking process to track which seats are
 * available for booking and which have been reserved or booked.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Seat information")
public class Seat {
    
    /**
     * Row identifier for the seat (e.g., "A", "B", "C").
     * Used to identify the row in the theatre layout.
     */
    @NotBlank
    @Schema(description = "Row identifier", example = "A", required = true)
    private String row;
    
    /**
     * Seat number within the row.
     * Must be a positive integer.
     */
    @Positive
    @Schema(description = "Seat number within the row", example = "1", required = true)
    private Integer number;
    
    /**
     * Current status of the seat.
     * Defaults to AVAILABLE for new seats.
     */
    @Builder.Default
    @Schema(description = "Current status of the seat", example = "BOOKED", defaultValue = "AVAILABLE")
    private SeatStatus status = SeatStatus.AVAILABLE;
    
    /**
     * Gets the seat identifier in the format "RowNumber" (e.g., "A1", "B5").
     * 
     * @return the formatted seat identifier
     */
    public String getSeatIdentifier() {
        return this.row + this.number;
    }
    
    /**
     * Checks if the seat is available for booking.
     * 
     * @return true if the seat is available, false otherwise
     */
    public boolean isAvailable() {
        return SeatStatus.AVAILABLE.equals(this.status);
    }
    
    /**
     * Checks if the seat is already booked.
     * 
     * @return true if the seat is booked, false otherwise
     */
    public boolean isBooked() {
        return SeatStatus.BOOKED.equals(this.status);
    }
    
    /**
     * Checks if the seat is currently selected (temporarily reserved).
     * 
     * @return true if the seat is selected, false otherwise
     */
    public boolean isSelected() {
        return SeatStatus.SELECTED.equals(this.status);
    }
}

