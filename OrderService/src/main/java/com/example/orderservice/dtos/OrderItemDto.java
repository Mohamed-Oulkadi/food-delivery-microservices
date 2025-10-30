package com.example.orderservice.dtos;

import lombok.Data;
import java.util.UUID;

@Data
public class OrderItemDto {
    private Long menuItemId;
    private int quantity;
    private double price; // In a real app, you'd fetch this from RestaurantService
}
