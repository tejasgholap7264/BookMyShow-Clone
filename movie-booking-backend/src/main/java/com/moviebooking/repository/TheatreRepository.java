package com.moviebooking.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.moviebooking.models.Theatre;

@Repository
public interface TheatreRepository extends MongoRepository<Theatre, String> {
    List<Theatre> findByLocationIgnoreCase(String location);
}

