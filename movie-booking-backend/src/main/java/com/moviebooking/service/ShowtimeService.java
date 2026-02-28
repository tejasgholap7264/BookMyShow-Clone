package com.moviebooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.moviebooking.dto.SeatsResponse;
import com.moviebooking.dto.ShowtimeCreateRequest;
import com.moviebooking.dto.TheatreResponse;
import com.moviebooking.enums.SeatStatus;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.models.Booking;
import com.moviebooking.models.Seat;
import com.moviebooking.models.Showtime;
import com.moviebooking.models.Theatre;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.ShowtimeRepository;
import com.moviebooking.repository.TheatreRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShowtimeService {
    
    private final ShowtimeRepository showtimeRepository;
    private final TheatreRepository theatreRepository;
    private final BookingRepository bookingRepository;
    
    public List<Showtime> getShowtimes(String movieId, String theatreId) {
        if (movieId != null && theatreId != null) {
            return showtimeRepository.findByMovieIdAndTheatreId(movieId, theatreId);
        } else if (movieId != null) {
            return showtimeRepository.findByMovieId(movieId);
        } else if (theatreId != null) {
            return showtimeRepository.findByTheatreId(theatreId);
        }
        return showtimeRepository.findAll();
    }
    
    public Showtime createShowtime(ShowtimeCreateRequest request) {
        Theatre theatre = theatreRepository.findById(request.getTheatreId())
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found"));
        
        Showtime showtime = Showtime.builder()
                .movieId(request.getMovieId())
                .theatreId(request.getTheatreId())
                .showDate(request.getShowDate())
                .price(request.getPrice())
                .availableSeats(theatre.getTotalSeats())
                .build();
        
        return showtimeRepository.save(showtime);
    }
    
    public SeatsResponse getSeats(String showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));
        
        Theatre theatre = theatreRepository.findById(showtime.getTheatreId())
                .orElseThrow(() -> new ResourceNotFoundException("Theatre not found"));
        
        List<Booking> bookings = bookingRepository.findByShowtimeId(showtimeId);
        List<Seat> bookedSeats = new ArrayList<>();
        bookings.forEach(booking -> bookedSeats.addAll(booking.getSeats()));
        
        List<Seat> seats = generateSeatLayout(theatre, bookedSeats);
        
        return SeatsResponse.builder()
                .showtimeId(showtimeId)
                .theatre(TheatreResponse.builder()
                        .id(theatre.getId())
                        .name(theatre.getName())
                        .location(theatre.getLocation())
                        .totalSeats(theatre.getTotalSeats())
                        .rows(theatre.getRows())
                        .seatsPerRow(theatre.getSeatsPerRow())
                        .build())
                .seats(seats)
                .build();
    }
    
    private List<Seat> generateSeatLayout(Theatre theatre, List<Seat> bookedSeats) {
        List<Seat> seats = new ArrayList<>();
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
        
        for (int i = 0; i < theatre.getRows(); i++) {
            for (int j = 1; j <= theatre.getSeatsPerRow(); j++) {
                String row = rows[i];
                SeatStatus status = SeatStatus.AVAILABLE;
                
                for (Seat bookedSeat : bookedSeats) {
                    if (bookedSeat.getRow().equals(row) && bookedSeat.getNumber().equals(j)) {
                        status = SeatStatus.BOOKED;
                        break;
                    }
                }
                
                seats.add(Seat.builder()
                        .row(row)
                        .number(j)
                        .status(status)
                        .build());
            }
        }
        
        return seats;
    }
}

