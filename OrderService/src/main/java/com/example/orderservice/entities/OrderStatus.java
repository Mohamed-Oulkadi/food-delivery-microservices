package com.example.orderservice.entities;



public enum OrderStatus {
    PLACED,
    ACCEPTED,
    PREPARING,
    READY_FOR_PICKUP,
    DELIVERING,
    DELIVERED,
    COMPLETED,
    CANCELLED
}