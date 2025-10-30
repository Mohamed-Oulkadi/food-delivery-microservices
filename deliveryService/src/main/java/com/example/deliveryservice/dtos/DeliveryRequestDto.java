package com.example.deliveryservice.dtos;

import lombok.Data;

@Data
public class DeliveryRequestDto {
    private Long orderId;
    private Long driverId;
    // We could add customer address info here, etc.
}