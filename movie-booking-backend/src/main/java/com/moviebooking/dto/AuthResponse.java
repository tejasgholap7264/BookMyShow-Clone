package com.moviebooking.dto;

import com.moviebooking.dto.UserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for authentication responses.
 * 
 * <p>This DTO contains the JWT token and user information returned
 * after successful authentication.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Authentication response")
public class AuthResponse {
    
    /**
     * JWT access token for authentication.
     */
    @Schema(description = "JWT access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", required = true)
    private String accessToken;
    
    /**
     * Type of token (always "bearer" for JWT).
     */
    @Schema(description = "Token type", example = "bearer", defaultValue = "bearer", required = true)
    private String tokenType;
    
    /**
     * User information.
     */
    @Schema(description = "User information", required = true)
    private UserResponse user;
}

