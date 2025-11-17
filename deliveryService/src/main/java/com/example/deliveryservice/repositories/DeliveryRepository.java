package com.example.deliveryservice.repositories;

import com.example.deliveryservice.entities.Delivery;
import com.example.deliveryservice.entities.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    // This will be very useful:
    Optional<Delivery> findByOrderId(Long orderId);

    List<Delivery> findByStatusAndDriverIdIsNull(DeliveryStatus status);

    List<Delivery> findByStatus(DeliveryStatus status);

    List<Delivery> findByDriverIdAndStatusNot(Long driverId, DeliveryStatus status);
}
