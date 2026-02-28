package com.moviebooking.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Health check controller for monitoring application status.
 * 
 * <p>This controller provides endpoints for checking the health and status
 * of the application, which is useful for monitoring and load balancers.</p>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "Health check endpoints")
public class HealthController {
    
    /**
     * Health check endpoint to verify application status.
     * 
     * <p>This endpoint returns the current status of the application
     * and can be used by monitoring systems and load balancers.</p>
     * 
     * @return ResponseEntity containing the health status
     */
    @GetMapping
    @Operation(
        summary = "Health check",
        description = "Returns the current health status of the application"
    )
    @ApiResponse(
        responseCode = "200",
        description = "Application is healthy",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = Map.class),
            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                name = "Healthy Status",
                value = """
                    {
                      "status": "UP",
                      "timestamp": "2024-01-01T12:00:00",
                      "version": "1.0.0",
                      "service": "Movie Booking System"
                    }
                    """
            )
        )
    )
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now().toString());
        status.put("version", "1.0.0");
        status.put("service", "Movie Booking System");
        return ResponseEntity.ok(status);
    }
} 