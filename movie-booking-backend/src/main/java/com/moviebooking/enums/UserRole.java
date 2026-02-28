package com.moviebooking.enums;

/**
 * Enumeration representing user roles in the movie booking system.
 * 
 * <p>User roles determine the level of access and permissions a user has
 * within the system. Different roles can perform different operations.</p>
 * 
 * <p>Role hierarchy and permissions:</p>
 * <ul>
 *   <li><strong>USER</strong>: Basic user who can browse movies, book seats, and view their bookings</li>
 *   <li><strong>MANAGER</strong>: Can manage theatres, showtimes, and view booking reports</li>
 *   <li><strong>ADMIN</strong>: Full system access including user management and system configuration</li>
 * </ul>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
public enum UserRole {
    
    /**
     * Administrator role with full system access.
     * Can perform all operations including user management, movie management,
     * theatre management, and system configuration.
     */
    ADMIN,
    
    /**
     * Regular user role with basic booking capabilities.
     * Can browse movies, book seats, and view their own booking history.
     */
    USER,
    
    /**
     * Manager role with theatre and showtime management capabilities.
     * Can manage theatres, create showtimes, and view booking reports.
     */
    MANAGER
}

