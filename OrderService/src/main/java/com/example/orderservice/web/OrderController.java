package com.example.orderservice.web;

import com.example.orderservice.dtos.OrderDto;
import com.example.orderservice.dtos.OrderItemDto;
import com.example.orderservice.dtos.OrderRequestDto;
import com.example.orderservice.dtos.OrderStatsDto;
import com.example.orderservice.entities.Order;
import com.example.orderservice.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

//@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderRequestDto orderRequest) {
        Order createdOrder = orderService.createOrder(orderRequest);
        return new ResponseEntity<>(toDto(createdOrder), HttpStatus.CREATED);
    }

    // GET /api/orders - return all orders (handy for quick checks in browser)
    @GetMapping
    public ResponseEntity<java.util.List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders().stream().map(this::toDto).collect(Collectors.toList()));
    }

    // GET /api/orders/customer/{customerId} - orders for a specific customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<java.util.List<OrderDto>> getOrdersByCustomer(@PathVariable String customerId) {
        try {
            Long id = Long.parseLong(customerId);
            java.util.List<Order> orders = orderService.getOrdersByCustomer(id);
            return ResponseEntity.ok(orders.stream().map(this::toDto).collect(java.util.stream.Collectors.toList()));
        } catch (NumberFormatException ex) {
            // If client sent non-numeric id, return empty list or 400. We choose empty list for robustness.
            return ResponseEntity.ok(java.util.List.of());
        }
    }

    // GET /api/orders/restaurant/{restaurantId} - orders for a specific restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<java.util.List<OrderDto>> getOrdersByRestaurant(@PathVariable String restaurantId) {
        try {
            Long id = Long.parseLong(restaurantId);
            java.util.List<Order> orders = orderService.getOrdersByRestaurant(id);
            return ResponseEntity.ok(orders.stream().map(this::toDto).collect(java.util.stream.Collectors.toList()));
        } catch (NumberFormatException ex) {
            return ResponseEntity.ok(java.util.List.of());
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(toDto(orderService.getOrderById(orderId)));
    }

    @GetMapping("/stats")
    public ResponseEntity<OrderStatsDto> getOrderStats() {
        return ResponseEntity.ok(orderService.getOrderStats());
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<com.example.orderservice.dtos.AdminStatsDto> getAdminStats() {
        return ResponseEntity.ok(orderService.getAdminStats());
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long orderId, @RequestBody java.util.Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(toDto(updatedOrder));
    }

    private OrderDto toDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getOrderId());
        dto.setCustomerId(order.getUserId());
        dto.setRestaurantId(order.getRestaurantId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setDate(order.getOrderDate());
        dto.setItems(order.getItems().stream().map(item -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setMenuItemId(item.getMenuItemId());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setPrice(item.getPrice());
            return itemDto;
        }).collect(java.util.stream.Collectors.toList()));
        return dto;
    }
}