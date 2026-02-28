package com.moviebooking.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moviebooking.dto.AuthResponse;
import com.moviebooking.dto.UserCreateRequest;
import com.moviebooking.dto.UserLoginRequest;
import com.moviebooking.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for handling authentication operations.
 * 
 * <p>This controller provides endpoints for user registration and login.
 * All endpoints are publicly accessible and do not require authentication.</p>
 * 
 * <p>Available endpoints:</p>
 * <ul>
 *   <li><strong>POST /auth/register</strong>: Register a new user</li>
 *   <li><strong>POST /auth/login</strong>: Authenticate an existing user</li>
 * </ul>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management endpoints")
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Registers a new user in the system.
     * 
     * <p>This endpoint accepts user registration details and creates a new user account.
     * Upon successful registration, a JWT token is returned for immediate authentication.</p>
     * 
     * <p>Request validation includes:</p>
     * <ul>
     *   <li>Email format validation</li>
     *   <li>Required field validation</li>
     *   <li>Email uniqueness check</li>
     * </ul>
     * 
     * @param request the user registration request containing email, name, password, and role
     * @return ResponseEntity containing the authentication response with JWT token
     * @throws BadRequestException if email is already registered or validation fails
     */
    @PostMapping("/register")
    @Operation(
        summary = "Register a new user",
        description = "Creates a new user account and returns a JWT token for immediate authentication"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "User registered successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AuthResponse.class),
                examples = @ExampleObject(
                    name = "Successful Registration",
                    value = """
                        {
                          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          "tokenType": "bearer",
                          "user": {
                            "id": "550e8400-e29b-41d4-a716-446655440000",
                            "email": "john.doe@example.com",
                            "name": "John Doe",
                            "role": "USER"
                          }
                        }
                        """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - Email already registered or validation failed",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class),
                examples = @ExampleObject(
                    name = "Email Already Exists",
                    value = """
                        {
                          "message": "Email already registered",
                          "data": null,
                          "success": false
                        }
                        """
                )
            )
        ),
        @ApiResponse(
            responseCode = "422",
            description = "Validation error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class)
            )
        )
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserCreateRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Authenticates a user and returns a JWT token.
     * 
     * <p>This endpoint validates user credentials and returns a JWT token
     * for authenticated access to protected endpoints.</p>
     * 
     * <p>The JWT token should be included in subsequent requests in the
     * Authorization header as "Bearer {token}".</p>
     * 
     * @param request the login request containing email and password
     * @return ResponseEntity containing the authentication response with JWT token
     * @throws BadRequestException if email or password is invalid
     */
    @PostMapping("/login")
    @Operation(
        summary = "Authenticate user",
        description = "Validates user credentials and returns a JWT token for authentication"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User authenticated successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AuthResponse.class),
                examples = @ExampleObject(
                    name = "Successful Login",
                    value = """
                        {
                          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                          "tokenType": "bearer",
                          "user": {
                            "id": "550e8400-e29b-41d4-a716-446655440000",
                            "email": "john.doe@example.com",
                            "name": "John Doe",
                            "role": "USER"
                          }
                        }
                        """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - Invalid email or password",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class),
                examples = @ExampleObject(
                    name = "Invalid Credentials",
                    value = """
                        {
                          "message": "Invalid email or password",
                          "data": null,
                          "success": false
                        }
                        """
                )
            )
        ),
        @ApiResponse(
            responseCode = "422",
            description = "Validation error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class)
            )
        )
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}

