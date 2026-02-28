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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.moviebooking.dto.SeatsResponse;
import com.moviebooking.dto.ShowtimeCreateRequest;
import com.moviebooking.models.Showtime;
import com.moviebooking.service.ShowtimeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
public class ShowtimeController {
    
    private final ShowtimeService showtimeService;
    
    @GetMapping
    public ResponseEntity<List<Showtime>> getShowtimes(
            @RequestParam(required = false) String movieId,
            @RequestParam(required = false) String theatreId) {
        List<Showtime> showtimes = showtimeService.getShowtimes(movieId, theatreId);
        return ResponseEntity.ok(showtimes);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Showtime> createShowtime(@Valid @RequestBody ShowtimeCreateRequest request) {
        Showtime showtime = showtimeService.createShowtime(request);
        return new ResponseEntity<>(showtime, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}/seats")
    public ResponseEntity<SeatsResponse> getSeats(@PathVariable String id) {
        SeatsResponse response = showtimeService.getSeats(id);
        return ResponseEntity.ok(response);
    }
}

