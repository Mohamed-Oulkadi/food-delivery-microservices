package com.example.restaurantservice.dtos;

import lombok.Data;

@Data
public class MenuItemDto {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private boolean isAvailable;
}
