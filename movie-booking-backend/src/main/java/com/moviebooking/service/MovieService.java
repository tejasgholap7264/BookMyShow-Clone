package com.moviebooking.service;
import java.util.List;

import org.springframework.stereotype.Service;

import com.moviebooking.dto.MovieCreateRequest;
import com.moviebooking.exception.ResourceNotFoundException;
import com.moviebooking.models.Movie;
import com.moviebooking.repository.MovieRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieService {
    
    private final MovieRepository movieRepository;
    
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }
    
    public Movie getMovie(String id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
    }
    
    public Movie createMovie(MovieCreateRequest request) {
        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .genre(request.getGenre())
                .rating(request.getRating())
                .duration(request.getDuration())
                .language(request.getLanguage())
                .posterUrl(request.getPosterUrl())
                .releaseDate(request.getReleaseDate())
                .build();
        
        return movieRepository.save(movie);
    }
}

