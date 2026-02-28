package com.moviebooking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreCreateRequest {
    @NotBlank
    private String name;
    
    @NotBlank
    private String location;
    
    @Positive
    private Integer totalSeats;
    
    @Positive
    private Integer rows;
    
    @Positive
    private Integer seatsPerRow;
}

