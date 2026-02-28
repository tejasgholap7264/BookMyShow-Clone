package com.moviebooking.dto;

import com.moviebooking.enums.UserRole;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration requests.
 * 
 * <p>This DTO contains all the information required to create a new user account
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
@Schema(description = "User registration request")
public class UserCreateRequest {
    
    /**
     * User's email address. Must be unique across all users.
     */
    @Email
    @NotBlank
    @Schema(description = "User's email address", example = "john.doe@example.com", required = true)
    private String email;
    
    /**
     * User's full name.
     */
    @NotBlank
    @Size(min = 2, max = 100)
    @Schema(description = "User's full name", example = "John Doe", required = true, minLength = 2, maxLength = 100)
    private String name;
    
    /**
     * User's password. Must be at least 6 characters long.
     */
    @NotBlank
    @Size(min = 6, max = 100)
    @Schema(description = "User's password", example = "password123", required = true, minLength = 6, maxLength = 100)
    private String password;
    
   
}

