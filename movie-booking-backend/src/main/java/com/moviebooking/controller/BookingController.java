package com.moviebooking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moviebooking.dto.BookingCreateRequest;
import com.moviebooking.models.Booking;
import com.moviebooking.service.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST controller for handling booking operations.
 * 
 * <p>This controller provides endpoints for creating, retrieving, and managing
 * movie bookings. All endpoints require authentication.</p>
 * 
 * <p>Available endpoints:</p>
 * <ul>
 *   <li><strong>POST /bookings</strong>: Create a new booking</li>
 *   <li><strong>GET /bookings</strong>: Get user's booking history</li>
 *   <li><strong>GET /bookings/{id}</strong>: Get a specific booking</li>
 *   <li><strong>DELETE /bookings/{id}</strong>: Cancel a booking</li>
 * </ul>
 * 
 * @author Movie Booking Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class BookingController {
    
    private final BookingService bookingService;
    
    /**
     * Creates a new booking for the authenticated user.
     * 
     * <p>This endpoint allows users to book seats for a specific showtime.
     * The booking process includes seat availability validation and
     * automatic seat count updates.</p>
     * 
     * <p>The request must include:</p>
     * <ul>
     *   <li>Showtime ID</li>
     *   <li>List of seats to book</li>
     *   <li>Total amount for the booking</li>
     * </ul>
     * 
     * @param request the booking creation request
     * @param authentication the authenticated user's information
     * @return ResponseEntity containing the created booking
     * @throws BadRequestException if seats are unavailable or validation fails
     * @throws ResourceNotFoundException if showtime is not found
     */
    @PostMapping
    @Operation(
        summary = "Create a new booking",
        description = "Creates a new booking for the authenticated user with seat availability validation"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Booking created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Booking.class),
                examples = @ExampleObject(
                    name = "Successful Booking",
                    value = """
                        {
                          "id": "550e8400-e29b-41d4-a716-446655440000",
                          "userId": "user-uuid",
                          "showtimeId": "showtime-uuid",
                          "seats": [
                            {
                              "row": "A",
                              "number": 1,
                              "status": "BOOKED"
                            }
                          ],
                          "totalAmount": 12.50,
                          "bookingDate": "2024-01-01T00:00:00.000Z",
                          "status": "confirmed"
                        }
                        """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - Seats unavailable or validation failed",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class),
                examples = @ExampleObject(
                    name = "Seat Already Booked",
                    value = """
                        {
                          "message": "Seat A1 is already booked",
                          "data": null,
                          "success": false
                        }
                        """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Missing or invalid authentication token"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Not found - Showtime not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class)
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
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            @Parameter(hidden = true) Authentication authentication) {
        String userId = authentication.getName();
        Booking booking = bookingService.createBooking(request, userId);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }
    
    /**
     * Retrieves all bookings for the authenticated user.
     * 
     * <p>This endpoint returns the complete booking history for the
     * currently authenticated user, including both active and cancelled bookings.</p>
     * 
     * @param authentication the authenticated user's information
     * @return ResponseEntity containing the list of user's bookings
     */
    @GetMapping
    @Operation(
        summary = "Get user's booking history",
        description = "Retrieves all bookings for the authenticated user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Bookings retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Booking.class, type = "array")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Missing or invalid authentication token"
        )
    })
    public ResponseEntity<List<Booking>> getUserBookings(
            @Parameter(hidden = true) Authentication authentication) {
        String userId = authentication.getName();
        List<Booking> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }
    
    /**
     * Retrieves a specific booking by its ID.
     * 
     * <p>This endpoint allows users to view details of a specific booking.
     * Users can only view their own bookings.</p>
     * 
     * @param bookingId the ID of the booking to retrieve
     * @param authentication the authenticated user's information
     * @return ResponseEntity containing the booking details
     * @throws ResourceNotFoundException if booking is not found
     * @throws BadRequestException if user is not authorized to view this booking
     */
    @GetMapping("/{bookingId}")
    @Operation(
        summary = "Get a specific booking",
        description = "Retrieves details of a specific booking by ID (users can only view their own bookings)"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Booking retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Booking.class)
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Missing or invalid authentication token"
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - User not authorized to view this booking"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Not found - Booking not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class)
            )
        )
    })
    public ResponseEntity<Booking> getBooking(
            @Parameter(description = "Booking ID", example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable String bookingId,
            @Parameter(hidden = true) Authentication authentication) {
        String userId = authentication.getName();
        Booking booking = bookingService.getBooking(bookingId);
        
        // Check if user owns this booking
        if (!booking.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        return ResponseEntity.ok(booking);
    }
    
    /**
     * Cancels a booking and releases the seats.
     * 
     * <p>This endpoint allows users to cancel their bookings and release
     * the reserved seats back to the available pool.</p>
     * 
     * <p>Users can only cancel their own bookings, and bookings that are
     * not already cancelled.</p>
     * 
     * @param bookingId the ID of the booking to cancel
     * @param authentication the authenticated user's information
     * @return ResponseEntity containing the cancelled booking
     * @throws ResourceNotFoundException if booking is not found
     * @throws BadRequestException if user is not authorized to cancel this booking
     */
    @DeleteMapping("/{bookingId}")
    @Operation(
        summary = "Cancel a booking",
        description = "Cancels a booking and releases the reserved seats back to the available pool"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Booking cancelled successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Booking.class),
                examples = @ExampleObject(
                    name = "Cancelled Booking",
                    value = """
                        {
                          "id": "550e8400-e29b-41d4-a716-446655440000",
                          "userId": "user-uuid",
                          "showtimeId": "showtime-uuid",
                          "seats": [
                            {
                              "row": "A",
                              "number": 1,
                              "status": "BOOKED"
                            }
                          ],
                          "totalAmount": 12.50,
                          "bookingDate": "2024-01-01T00:00:00.000Z",
                          "status": "cancelled"
                        }
                        """
                )
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - Booking already cancelled or user not authorized",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class),
                examples = @ExampleObject(
                    name = "Already Cancelled",
                    value = """
                        {
                          "message": "Booking is already cancelled",
                          "data": null,
                          "success": false
                        }
                        """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - Missing or invalid authentication token"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Not found - Booking not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = com.moviebooking.dto.ApiResponse.class)
            )
        )
    })
    public ResponseEntity<Booking> cancelBooking(
            @Parameter(description = "Booking ID", example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable String bookingId,
            @Parameter(hidden = true) Authentication authentication) {
        String userId = authentication.getName();
        Booking booking = bookingService.cancelBooking(bookingId, userId);
        return ResponseEntity.ok(booking);
    }
}