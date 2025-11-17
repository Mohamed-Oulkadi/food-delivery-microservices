package com.example.deliveryservice.web;

import com.example.deliveryservice.dtos.AssignDeliveryDto;
import com.example.deliveryservice.dtos.DeliveryRequestDto;
import com.example.deliveryservice.dtos.UpdateDeliveryStatusDto;
import com.example.deliveryservice.entities.Delivery;
import com.example.deliveryservice.services.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<Delivery> createDelivery(@RequestBody DeliveryRequestDto request) {
        Delivery createdDelivery = deliveryService.createDelivery(request);
        return new ResponseEntity<>(createdDelivery, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<java.util.List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(id));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Delivery> getDeliveryByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(deliveryService.getDeliveryByOrderId(orderId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(@PathVariable Long id, @RequestBody UpdateDeliveryStatusDto statusUpdate) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, statusUpdate));
    }

    @GetMapping("/pending")
    public ResponseEntity<java.util.List<Delivery>> getPendingDeliveries() {
        return ResponseEntity.ok(deliveryService.getPendingDeliveries());
    }

    @GetMapping("/driver/{driverId}/active")
    public ResponseEntity<java.util.List<Delivery>> getActiveDeliveries(@PathVariable Long driverId) {
        return ResponseEntity.ok(deliveryService.getActiveDeliveriesForDriver(driverId));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Delivery> assignDelivery(@PathVariable Long id, @RequestBody AssignDeliveryDto assignRequest) {
        return ResponseEntity.ok(deliveryService.assignDelivery(id, assignRequest.getDriverId()));
    }
}
