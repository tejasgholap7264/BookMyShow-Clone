package com.moviebooking.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Movie entity representing a movie in the booking system.
 * 
 * <p>This entity contains all the information about a movie including
 * its title, description, genre, rating, duration, and other metadata.</p>
 * 
 * <p>Movies are managed by administrators and can be associated with
 * multiple showtimes across different theatres.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "movies")
public class Movie {
    
    /**
     * Unique identifier for the movie.
     * Auto-generated UUID when a new movie is created.
     */
    @Id
    private String id;
    
    /**
     * Title of the movie.
     */
    @NotBlank
    private String title;
    
    /**
     * Detailed description of the movie's plot and content.
     */
    @NotBlank
    private String description;
    
    /**
     * Genre of the movie (e.g., Action, Drama, Comedy, etc.).
     */
    @NotBlank
    private String genre;
    
    /**
     * Movie rating on a scale of 0.0 to 10.0.
     * Can be null if rating is not available.
     */
    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double rating;
    
    /**
     * Duration of the movie in minutes.
     */
    @Positive
    private Integer duration;
    
    /**
     * Language of the movie.
     */
    @NotBlank
    private String language;
    
    /**
     * URL to the movie's poster image.
     */
    @NotBlank
    private String posterUrl;
    
    /**
     * Release date of the movie.
     */
    @NotNull
    private LocalDateTime releaseDate;
    
    /**
     * Timestamp when the movie was added to the system.
     * Auto-generated when a new movie is saved.
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Pre-persist method to generate UUID if not set.
     * This ensures every movie has a unique identifier.
     */
    public void generateIdIfNotSet() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
}

