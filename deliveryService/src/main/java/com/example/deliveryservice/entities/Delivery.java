package com.example.deliveryservice.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deliveryId;

    @Column(unique = true)
    private Long orderId; // Foreign key from the OrderService

    private Long driverId; // Foreign key from a future DriverService

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime; // Set when status becomes DELIVERED
}
