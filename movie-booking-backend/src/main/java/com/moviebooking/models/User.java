package com.moviebooking.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.moviebooking.enums.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User entity representing a user in the movie booking system.
 * 
 * <p>This entity stores user information including authentication details,
 * personal information, and role-based access control.</p>
 * 
 * <p>The user can have different roles (ADMIN, USER, MANAGER) which determine
 * their access permissions within the system.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {
    
    /**
     * Unique identifier for the user.
     * Auto-generated UUID when a new user is created.
     */
    @Id
    private String id;
    
    /**
     * User's email address. Must be unique across all users.
     * Used for authentication and communication.
     */
    @Email
    @NotBlank
    @Indexed(unique = true)
    private String email;
    
    /**
     * User's full name.
     */
    @NotBlank
    private String name;
    
    /**
     * User's role in the system. Determines access permissions.
     * Defaults to USER role for new registrations.
     */
    @Builder.Default
    private UserRole role = UserRole.USER;
    
    /**
     * Hashed password for secure authentication.
     * Should never be stored in plain text.
     */
    @NotBlank
    private String hashedPassword;
    
    /**
     * Timestamp when the user account was created.
     * Auto-generated when a new user is saved.
     */
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Pre-persist method to generate UUID if not set.
     * This ensures every user has a unique identifier.
     */
    public void generateIdIfNotSet() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }
}

