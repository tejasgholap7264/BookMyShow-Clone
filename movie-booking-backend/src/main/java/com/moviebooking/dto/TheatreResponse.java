package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreResponse {
    private String id;
    private String name;
    private String location;
    private Integer totalSeats;
    private Integer rows;
    private Integer seatsPerRow;
}

