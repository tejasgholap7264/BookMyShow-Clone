package com.moviebooking.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeCreateRequest {
    @NotBlank
    private String movieId;
    
    @NotBlank
    private String theatreId;
    
    @NotNull
    private LocalDateTime showDate;
    
    @Positive
    private Double price;
}

