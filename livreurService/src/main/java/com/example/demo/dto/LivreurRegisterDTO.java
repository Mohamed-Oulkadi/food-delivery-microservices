package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivreurRegisterDTO {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String zoneActivite;
}

