package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// DTO pour la réponse de livraison
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivraisonResponseDTO {
    private Long id;
    private Long commandeId;
    private String statut;
    private BigDecimal distanceKm;
    private BigDecimal montantGain;
    private Long livreurId;
    private LocalDateTime dateCreation;
    private LocalDateTime dateAcceptation;
    private LocalDateTime dateDemarrage;
    private LocalDateTime dateLivraison;
}

