package com.moviebooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.moviebooking.models.Showtime;

@Repository
public interface ShowtimeRepository extends MongoRepository<Showtime, String> {
    List<Showtime> findByMovieId(String movieId);
    List<Showtime> findByTheatreId(String theatreId);
    List<Showtime> findByMovieIdAndTheatreId(String movieId, String theatreId);
}

