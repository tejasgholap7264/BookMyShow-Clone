package com.moviebooking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moviebooking.dto.MovieCreateRequest;
import com.moviebooking.models.Movie;
import com.moviebooking.service.MovieService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for handling movie operations.
 * 
 * <p>This controller provides endpoints for managing movies in the system.
 * Some endpoints require authentication and specific roles.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Tag(name = "Movies", description = "Movie management endpoints")
public class MovieController {
    
    private final MovieService movieService;
    
    /**
     * Retrieves all movies in the system.
     * 
     * @return ResponseEntity containing the list of all movies
     */
    @GetMapping
    @Operation(
        summary = "Get all movies",
        description = "Retrieves all movies available in the system"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Movies retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Movie.class, type = "array")
            )
        )
    })
    public ResponseEntity<List<Movie>> getAllMovies() {
        List<Movie> movies = movieService.getAllMovies();
        return ResponseEntity.ok(movies);
    }
    
    /**
     * Retrieves a specific movie by its ID.
     * 
     * @param id the ID of the movie to retrieve
     * @return ResponseEntity containing the movie details
     */
    @GetMapping("/{id}")
    @Operation(
        summary = "Get movie by ID",
        description = "Retrieves a specific movie by its unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Movie retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Movie.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Movie not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class)
            )
        )
    })
    public ResponseEntity<Movie> getMovie(
            @Parameter(description = "Movie ID", example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable String id) {
        Movie movie = movieService.getMovie(id);
        return ResponseEntity.ok(movie);
    }
    
    /**
     * Creates a new movie (Admin only).
     * 
     * @param request the movie creation request
     * @return ResponseEntity containing the created movie
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Create a new movie",
        description = "Creates a new movie in the system (Admin only)"
    )
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Movie created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Movie.class)
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Missing or invalid authentication token"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - Insufficient permissions (Admin role required)"
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
    public ResponseEntity<Movie> createMovie(@Valid @RequestBody MovieCreateRequest request) {
        Movie movie = movieService.createMovie(request);
        return new ResponseEntity<>(movie, HttpStatus.CREATED);
    }
}

