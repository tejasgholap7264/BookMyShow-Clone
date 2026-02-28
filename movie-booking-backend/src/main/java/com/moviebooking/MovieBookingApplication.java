package com.moviebooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * Main application class for the Movie Booking System.
 * 
 * <p>This is a Spring Boot application that provides a RESTful API for movie booking operations.
 * The application uses MongoDB as the database and implements JWT-based authentication.</p>
 * 
 * <p>Key features include:</p>
 * <ul>
 *   <li>User authentication and authorization</li>
 *   <li>Movie management</li>
 *   <li>Theatre and showtime management</li>
 *   <li>Seat booking and reservation</li>
 *   <li>Booking history and management</li>
 * </ul>
 * 
 * <p>The application follows a layered architecture pattern with clear separation of concerns
 * between controllers, services, repositories, and models.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@SpringBootApplication
@EnableMongoAuditing
public class MovieBookingApplication {
    
    /**
     * Main method to start the Spring Boot application.
     * 
     * @param args command line arguments passed to the application
     */
    public static void main(String[] args) {
        SpringApplication.run(MovieBookingApplication.class, args);
    }
}