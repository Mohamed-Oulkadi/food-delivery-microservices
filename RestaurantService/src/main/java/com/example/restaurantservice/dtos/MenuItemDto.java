package com.example.restaurantservice.dtos;

import lombok.Data;

@Data
public class MenuItemDto {
    private String name;
    private String description;
    private double price;
    private boolean isAvailable;
}
