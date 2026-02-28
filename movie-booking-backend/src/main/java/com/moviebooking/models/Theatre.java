package com.moviebooking.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Theatre entity representing a movie theatre in the booking system.
 * 
 * <p>This entity contains information about a theatre including its name,
 * location, seating capacity, and layout configuration.</p>
 * 
 * <p>The theatre layout is defined by the number of rows and seats per row,
 * which helps in seat management and booking operations.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "theatres")
public class Theatre {
    
    /**
     * Unique identifier for the theatre.
     * Auto-generated UUID when a new theatre is created.
     */
    @Id
    private String id;
    
    /**
     * Name of the theatre.
     */
    @NotBlank
    private String name;
    
    /**
     * Physical location/address of the theatre.
     */
    @NotBlank
    private String location;
    
    /**
     * Total number of seats in the theatre.
     * Should equal rows * seatsPerRow.
     */
    @Positive
    private Integer totalSeats;
    
    /**
     * Number of rows in the theatre.
     */
    @Positive
    private Integer rows;
    
    /**
     * Number of seats per row in the theatre.
     */
    @Positive
    private Integer seatsPerRow;
    
    /**
     * Timestamp when the theatre was added to the system.
     * Auto-generated when a new theatre is saved.
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Pre-persist method to generate UUID if not set.
     * This ensures every theatre has a unique identifier.
     */
    public void generateIdIfNotSet() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
    
    /**
     * Calculates the total seats based on rows and seats per row.
     * This method ensures consistency between the calculated and stored values.
     * 
     * @return the calculated total number of seats
     */
    public Integer calculateTotalSeats() {
        if (this.rows != null && this.seatsPerRow != null) {
            return this.rows * this.seatsPerRow;
        }
        return this.totalSeats;
    }
}

