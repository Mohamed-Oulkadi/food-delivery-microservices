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
        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setDriverId(request.getDriverId()); // Can be null
        delivery.setStatus(DeliveryStatus.PENDING);
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
}
