package com.example.restaurantservice.dtos;

import lombok.Data;

@Data
public class RestaurantDto {
    private String name;
    private String cuisineType;
    private String imageUrl;
    private Double rating;
    private String deliveryTime;
    private String address;
}
