package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivraisonCreateDTO {
    private Long commandeId;
    private BigDecimal distanceKm;
    private BigDecimal montantGain;
}