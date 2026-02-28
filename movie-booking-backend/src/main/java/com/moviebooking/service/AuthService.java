package com.moviebooking.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.moviebooking.dto.AuthResponse;
import com.moviebooking.dto.UserCreateRequest;
import com.moviebooking.dto.UserLoginRequest;
import com.moviebooking.dto.UserResponse;
import com.moviebooking.exception.BadRequestException;
import com.moviebooking.models.User;
import com.moviebooking.enums.UserRole;
import com.moviebooking.repository.UserRepository;
import com.moviebooking.utils.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service class for handling authentication and user management operations.
 * 
 * <p>This service provides functionality for:</p>
 * <ul>
 *   <li>User registration with password encryption</li>
 *   <li>User login with JWT token generation</li>
 *   <li>Email uniqueness validation</li>
 *   <li>Password verification</li>
 * </ul>
 * 
 * <p>The service ensures secure authentication by using BCrypt password
 * hashing and JWT tokens for session management.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    /**
     * Registers a new user in the system.
     * 
     * <p>This method performs the following operations:</p>
     * <ul>
     *   <li>Validates email uniqueness</li>
     *   <li>Encrypts the password using BCrypt</li>
     *   <li>Creates a new user entity</li>
     *   <li>Generates a JWT token for immediate authentication</li>
     * </ul>
     * 
     * @param request the user registration request containing user details
     * @return authentication response with JWT token and user information
     * @throws BadRequestException if the email is already registered
     */
    public AuthResponse register(UserCreateRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        // Check if email is already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: Email already exists: {}", request.getEmail());
            throw new BadRequestException("Email already registered");
        }
        
        // Create new user with encrypted password
        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .role(UserRole.USER) //default role is user
                .hashedPassword(passwordEncoder.encode(request.getPassword()))
                .build();
        
        // Generate ID for the user
        user.generateIdIfNotSet();
        
        // Save user to database
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        
        log.info("Successfully registered user: {}", user.getId());
        
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("bearer")
                .user(UserResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .build();
    }
    
    /**
     * Authenticates a user and generates a JWT token.
     * 
     * <p>This method performs the following operations:</p>
     * <ul>
     *   <li>Finds the user by email</li>
     *   <li>Verifies the provided password against the stored hash</li>
     *   <li>Generates a JWT token for successful authentication</li>
     * </ul>
     * 
     * @param request the login request containing email and password
     * @return authentication response with JWT token and user information
     * @throws BadRequestException if email or password is invalid
     */
    public AuthResponse login(UserLoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found for email: {}", request.getEmail());
                    return new BadRequestException("Invalid email or password");
                });
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getHashedPassword())) {
            log.warn("Login failed: Invalid password for email: {}", request.getEmail());
            throw new BadRequestException("Invalid email or password");
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        
        log.info("Successfully logged in user: {}", user.getId());
        
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("bearer")
                .user(UserResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .build();
    }
}

