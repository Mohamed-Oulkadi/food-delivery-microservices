package com.example.deliveryservice.services;

import com.example.deliveryservice.dtos.DeliveryRequestDto;
import com.example.deliveryservice.dtos.UpdateDeliveryStatusDto;
import com.example.deliveryservice.entities.Delivery;
import com.example.deliveryservice.entities.DeliveryStatus;
import com.example.deliveryservice.repositories.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    @Transactional
    public Delivery createDelivery(DeliveryRequestDto request) {
        // Check if driver already has an active delivery
        if (request.getDriverId() != null) {
            java.util.List<Delivery> activeDeliveries = getActiveDeliveriesForDriver(request.getDriverId());
            if (!activeDeliveries.isEmpty()) {
                throw new IllegalStateException("Driver already has an active delivery");
            }
        }

        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setDriverId(request.getDriverId()); // Can be null
        delivery.setCustomerAddress(request.getCustomerAddress());
        delivery.setRestaurantName(request.getRestaurantName());
        delivery.setStatus(DeliveryStatus.ACCEPTED); // Driver creates it when accepting
        delivery.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(30)); // Simple estimate

        return deliveryRepository.save(delivery);
    }

    public Delivery getDeliveryById(Long deliveryId) {
        return deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }

    public Delivery getDeliveryByOrderId(Long orderId) {
        return deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery not found for order: " + orderId));
    }

    @Transactional
    public Delivery updateDeliveryStatus(Long deliveryId, UpdateDeliveryStatusDto statusUpdate) {
        Delivery delivery = getDeliveryById(deliveryId);
        DeliveryStatus newStatus = DeliveryStatus.valueOf(statusUpdate.getStatus().toUpperCase());

        delivery.setStatus(newStatus);

        if (newStatus == DeliveryStatus.DELIVERED) {
            delivery.setActualDeliveryTime(LocalDateTime.now());
        }

        return deliveryRepository.save(delivery);
    }

    public java.util.List<Delivery> getPendingDeliveries() {
        return deliveryRepository.findByStatus(DeliveryStatus.PENDING);
    }

    public java.util.List<Delivery> getActiveDeliveriesForDriver(Long driverId) {
        if (driverId == null) {
            return java.util.List.of();
        }
        // Exclude COMPLETED and CANCELLED (Driver is blocked until COMPLETED)
        return deliveryRepository.findByDriverIdAndStatusNot(driverId, DeliveryStatus.COMPLETED)
                .stream()
                .filter(d -> d.getStatus() != DeliveryStatus.CANCELLED)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public Delivery assignDelivery(Long deliveryId, Long driverId) {
        if (driverId == null) {
            throw new IllegalArgumentException("Driver ID is required to accept a delivery");
        }

        // Check if driver already has an active delivery
        java.util.List<Delivery> activeDeliveries = getActiveDeliveriesForDriver(driverId);
        if (!activeDeliveries.isEmpty()) {
            throw new IllegalStateException("Driver already has an active delivery");
        }

        Delivery delivery = getDeliveryById(deliveryId);
        if (delivery.getDriverId() != null && !delivery.getDriverId().equals(driverId)) {
            throw new IllegalStateException("Delivery already assigned to another driver");
        }
        delivery.setDriverId(driverId);
        delivery.setStatus(DeliveryStatus.ACCEPTED);
        if (delivery.getEstimatedDeliveryTime() == null) {
            delivery.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(30));
        }
        return deliveryRepository.save(delivery);
    }

    public java.util.List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public java.util.List<Delivery> getDeliveriesForDriver(Long driverId) {
        return deliveryRepository.findByDriverId(driverId);
    }
}
