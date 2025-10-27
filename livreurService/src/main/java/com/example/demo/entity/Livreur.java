package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "livreurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Livreur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String telephone;

    @Column(name = "zone_activite")
    private String zoneActivite;

    @Column(name = "is_disponible", nullable = false)
    private Boolean isDisponible = false;

    @Column(name = "total_gains", precision = 10, scale = 2)
    private BigDecimal totalGains = BigDecimal.ZERO;

    public void toggleDisponibilite() {
        this.isDisponible = !this.isDisponible;
    }
}