package com.moviebooking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.moviebooking.dto.TheatreCreateRequest;
import com.moviebooking.models.Theatre;
import com.moviebooking.repository.TheatreRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TheatreService {
    
    private final TheatreRepository theatreRepository;
    
    public List<Theatre> getAllTheatres() {
        return theatreRepository.findAll();
    }
    
    public Theatre createTheatre(TheatreCreateRequest request) {
        Theatre theatre = Theatre.builder()
                .name(request.getName())
                .location(request.getLocation())
                .totalSeats(request.getTotalSeats())
                .rows(request.getRows())
                .seatsPerRow(request.getSeatsPerRow())
                .build();
        
        return theatreRepository.save(theatre);
    }
}

