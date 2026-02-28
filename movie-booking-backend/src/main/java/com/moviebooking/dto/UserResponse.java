package com.moviebooking.dto;

import com.moviebooking.enums.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user information responses.
 * 
 * <p>This DTO contains user information that is safe to return to clients,
 * excluding sensitive information like passwords.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User information response")
public class UserResponse {
    
    /**
     * Unique identifier for the user.
     */
    @Schema(description = "User ID", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
    private String id;
    
    /**
     * User's email address.
     */
    @Schema(description = "User's email address", example = "john.doe@example.com", required = true)
    private String email;
    
    /**
     * User's full name.
     */
    @Schema(description = "User's full name", example = "John Doe", required = true)
    private String name;
    
    /**
     * User's role in the system.
     */
    @Schema(description = "User's role", example = "USER", required = true)
    private UserRole role;
}

