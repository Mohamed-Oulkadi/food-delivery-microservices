package com.example.deliveryservice.entities;


public enum DeliveryStatus {
    PENDING,        // Order placed, waiting for a driver
    ACCEPTED,       // Driver has accepted the delivery
    PICKED_UP,      // Driver has picked up the food
    IN_TRANSIT,     // Driver is on the way to the customer
    DELIVERED,      // Customer has received the food
    COMPLETED,      // Customer has confirmed receipt
    CANCELLED       // Delivery was cancelled
}