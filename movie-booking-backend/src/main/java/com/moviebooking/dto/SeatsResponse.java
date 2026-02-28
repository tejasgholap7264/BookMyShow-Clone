package com.moviebooking.dto;

import java.util.List;

import com.moviebooking.models.Seat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatsResponse {
    private String showtimeId;
    private TheatreResponse theatre;
    private List<Seat> seats;
}

