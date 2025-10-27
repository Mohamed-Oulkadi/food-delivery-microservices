package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GainsDTO {
    private BigDecimal totalGains;
    private BigDecimal gainsMoisActuel;
    private Long nombreLivraisonsMois;
}
