package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "livraisons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Livraison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "commande_id", nullable = false)
    private Long commandeId;

    @Column(nullable = false)
    private String statut;

    @Column(name = "distance_km", precision = 10, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "montant_gain", precision = 10, scale = 2)
    private BigDecimal montantGain;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livreur_id")
    private Livreur livreur;

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_acceptation")
    private LocalDateTime dateAcceptation;

    @Column(name = "date_demarrage")
    private LocalDateTime dateDemarrage;

    @Column(name = "date_livraison")
    private LocalDateTime dateLivraison;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (statut == null) {
            statut = "EN_ATTENTE";
        }
    }

    public void accepter() {
        this.statut = "ACCEPTEE";
        this.dateAcceptation = LocalDateTime.now();
    }

    public void demarrer() {
        this.statut = "EN_COURS";
        this.dateDemarrage = LocalDateTime.now();
    }

    public void terminer() {
        this.statut = "TERMINEE";
        this.dateLivraison = LocalDateTime.now();
    }
}