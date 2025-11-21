package com.example.restaurantservice.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Long restaurantId;

    private String name;
    private String cuisineType;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    
    private Double rating;
    private String deliveryTime;
    private String address;
    private String phoneNumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "menu_id", referencedColumnName = "menuId")
    private Menu menu;

    public Restaurant(String name, String cuisineType, String imageUrl, String address, String phoneNumber) {
        this.name = name;
        this.cuisineType = cuisineType;
        this.imageUrl = imageUrl;
        this.address = address;
        this.phoneNumber = phoneNumber;
    }
}
