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

            Delivery completed = new Delivery();
            completed.setOrderId(1L);
            completed.setDriverId(101L);
            completed.setCustomerAddress("123 Oak Street, Apt 4B");
            completed.setRestaurantName("Amici's Italian Kitchen");
            completed.setStatus(DeliveryStatus.DELIVERED);
            completed.setEstimatedDeliveryTime(LocalDateTime.now().minusMinutes(45));
            completed.setActualDeliveryTime(LocalDateTime.now().minusMinutes(5));

            Delivery pending = new Delivery();
            pending.setOrderId(2L);
            pending.setCustomerAddress("456 Maple Avenue");
            pending.setRestaurantName("Spice of India");
            pending.setStatus(DeliveryStatus.PENDING);
            pending.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(25));

            Delivery active = new Delivery();
            active.setOrderId(3L);
            active.setDriverId(101L);
            active.setCustomerAddress("789 Pine Road, Unit 12");
            active.setRestaurantName("Sushi Paradise");
            active.setStatus(DeliveryStatus.IN_TRANSIT);
            active.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(10));

            deliveryRepository.save(completed);
            deliveryRepository.save(pending);
            deliveryRepository.save(active);
            System.out.println("Delivery database seeded with demo deliveries.");
        }
    }
}