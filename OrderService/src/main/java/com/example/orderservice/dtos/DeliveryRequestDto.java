package com.example.orderservice.dtos;

import lombok.Data;

@Data
public class DeliveryRequestDto {
    private Long orderId;
    private Long driverId;
    private String customerAddress;
    private String restaurantName;
}