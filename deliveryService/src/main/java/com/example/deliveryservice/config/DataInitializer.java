package com.example.deliveryservice.config;

import com.example.deliveryservice.entities.Delivery;
import com.example.deliveryservice.entities.DeliveryStatus;
import com.example.deliveryservice.repositories.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final DeliveryRepository deliveryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (deliveryRepository.count() == 0) {
            System.out.println("Seeding Delivery database...");

            Delivery delivery = new Delivery();
            delivery.setOrderId(1L); // Links to the seeded order from OrderService
            delivery.setDriverId(101L); // A sample driver ID
            delivery.setStatus(DeliveryStatus.DELIVERED);
            delivery.setEstimatedDeliveryTime(LocalDateTime.now().minusMinutes(15));
            delivery.setActualDeliveryTime(LocalDateTime.now().minusMinutes(5));

            deliveryRepository.save(delivery);
            System.out.println("Delivery database seeded with 1 delivery.");
        }
    }
}