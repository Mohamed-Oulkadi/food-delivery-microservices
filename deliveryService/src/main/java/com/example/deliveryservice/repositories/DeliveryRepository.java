package com.example.deliveryservice.repositories;

import com.example.deliveryservice.entities.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    // This will be very useful:
    Optional<Delivery> findByOrderId(Long orderId);
}
