package com.moviebooking.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user login requests.
 * 
 * <p>This DTO contains the credentials required to authenticate a user
 * in the movie booking system.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User login request")
public class UserLoginRequest {
    
    /**
     * User's email address.
     */
    @Email
    @NotBlank
    @Schema(description = "User's email address", example = "john.doe@example.com", required = true)
    private String email;
    
    /**
     * User's password.
     */
    @NotBlank
    @Schema(description = "User's password", example = "password123", required = true)
    private String password;
}

