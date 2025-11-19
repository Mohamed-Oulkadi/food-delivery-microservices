package com.example.restaurantservice.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.*;

@Entity
@Data
@NoArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long restaurantId;

    private String name;
    private String cuisineType;
    private String imageUrl;
    private Double rating;
    private String deliveryTime;
    private String address;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "menu_id", referencedColumnName = "menuId")
    private Menu menu;

    public Restaurant(String name, String cuisineType, String imageUrl, String address) {
        this.name = name;
        this.cuisineType = cuisineType;
        this.imageUrl = imageUrl;
        this.address = address;
    }
}
