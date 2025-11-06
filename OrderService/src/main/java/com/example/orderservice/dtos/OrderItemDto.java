package com.example.orderservice.dtos;

import lombok.Data;

@Data
public class OrderItemDto {
    // IDs may be strings on the frontend; accept string and parse in the service
    private Long menuItemId;
    private int quantity;
    // Price is optional; if not provided, the service will set to 0 or fetch the price
    private Double price;
}
