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

    private String customerAddress;
    private String restaurantName;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime; // Set when status becomes DELIVERED

    public Long getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(Long deliveryId) {
        this.deliveryId = deliveryId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
    }

    public LocalDateTime getEstimatedDeliveryTime() {
        return estimatedDeliveryTime;
    }

    public void setEstimatedDeliveryTime(LocalDateTime estimatedDeliveryTime) {
        this.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    public LocalDateTime getActualDeliveryTime() {
        return actualDeliveryTime;
    }

    public void setActualDeliveryTime(LocalDateTime actualDeliveryTime) {
        this.actualDeliveryTime = actualDeliveryTime;
    }
}
