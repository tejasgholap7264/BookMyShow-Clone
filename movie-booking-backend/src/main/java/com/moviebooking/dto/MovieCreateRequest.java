package com.moviebooking.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
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
public class MovieCreateRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    private String description;
    
    @NotBlank
    private String genre;
    
    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double rating;
    
    @Positive
    private Integer duration;
    
    @NotBlank
    private String language;
    
    @NotBlank
    private String posterUrl;
    
    @NotNull
    private LocalDateTime releaseDate;
}

