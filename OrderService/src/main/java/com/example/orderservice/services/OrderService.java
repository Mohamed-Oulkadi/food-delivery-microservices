package com.example.orderservice.services;

import com.example.orderservice.dtos.DeliveryRequestDto;
import com.example.orderservice.dtos.OrderItemDto;
import com.example.orderservice.dtos.OrderRequestDto;
import com.example.orderservice.dtos.OrderStatsDto;
import com.example.orderservice.entities.Order;
import com.example.orderservice.entities.OrderItem;
import com.example.orderservice.entities.OrderStatus;
import com.example.orderservice.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final WebClient webClient;

    @Transactional
    public Order createOrder(OrderRequestDto orderRequest) {
        Order order = new Order();
        // Parse IDs which may come as strings from the frontend
        try {
            if (orderRequest.getCustomerId() != null) {
                order.setUserId(orderRequest.getCustomerId());
            }
        } catch (NumberFormatException ex) {
            // ignore — leave as null or handle differently if needed
        }
        try {
            if (orderRequest.getRestaurantId() != null) {
                order.setRestaurantId(orderRequest.getRestaurantId());
            }
        } catch (NumberFormatException ex) {
            // ignore
        }
        order.setStatus(OrderStatus.PLACED);
        
        // Set delivery address
        if (orderRequest.getDeliveryAddress() != null && !orderRequest.getDeliveryAddress().isEmpty()) {
            order.setDeliveryAddress(orderRequest.getDeliveryAddress());
        } else {
            order.setDeliveryAddress("Customer Address Placeholder");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemDto itemDto : orderRequest.getItems()) {
            // In a real system, you would call RestaurantService here
            // to verify the price, but we trust the DTO for simplicity.

            OrderItem item = new OrderItem();
            try {
                if (itemDto.getMenuItemId() != null) {
                    item.setMenuItemId(itemDto.getMenuItemId());
                }
            } catch (NumberFormatException ex) {
                // ignore
            }
            item.setQuantity(itemDto.getQuantity());
            item.setPrice(itemDto.getPrice() != null ? itemDto.getPrice() : 0.0);
            item.setOrder(order); // Link item to the order

            orderItems.add(item);
            totalAmount += item.getPrice() * item.getQuantity();
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // Create a delivery request
        DeliveryRequestDto deliveryRequestDto = new DeliveryRequestDto();
        deliveryRequestDto.setOrderId(savedOrder.getOrderId());
        // In a real system, you would fetch customer address and restaurant name from other services
        deliveryRequestDto.setCustomerAddress(savedOrder.getDeliveryAddress());
        deliveryRequestDto.setRestaurantName("Restaurant Name Placeholder");
        
        System.out.println("=== ORDER SERVICE: Creating delivery for order " + savedOrder.getOrderId() + " ===");
        System.out.println("Customer Address being sent: " + deliveryRequestDto.getCustomerAddress());

        try {
            webClient.post()
                    .uri("/api/deliveries")
                    .bodyValue(deliveryRequestDto)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .subscribe(
                        response -> System.out.println("Delivery request sent successfully for order: " + savedOrder.getOrderId()),
                        error -> {
                            System.err.println("Failed to send delivery request for order: " + savedOrder.getOrderId() + " Error: " + error.getMessage());
                            error.printStackTrace();
                        }
                    );
        } catch (Exception error) {
            System.err.println("Failed to initiate delivery request for order: " + savedOrder.getOrderId() + " Error: " + error.getMessage());
            error.printStackTrace();
        }

        return savedOrder;
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }

    // Return all orders (useful for quick testing / admin views)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        if (customerId == null) return List.of();
        return orderRepository.findByUserId(customerId);
    }

    public List<Order> getOrdersByRestaurant(Long restaurantId) {
        if (restaurantId == null) return List.of();
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public OrderStatsDto getOrderStats() {
        List<Order> allOrders = orderRepository.findAll();
        long totalOrders = allOrders.size();
        long deliveredOrders = allOrders.stream()
                .filter(order -> OrderStatus.DELIVERED.equals(order.getStatus()))
                .count();
        long pendingOrders = allOrders.stream()
                .filter(order -> {
                    OrderStatus status = order.getStatus();
                    return status != null
                            && status != OrderStatus.DELIVERED
                            && status != OrderStatus.CANCELLED;
                })
                .count();

        return new OrderStatsDto(totalOrders, pendingOrders, deliveredOrders);
    }

    public com.example.orderservice.dtos.AdminStatsDto getAdminStats() {
        List<Order> allOrders = orderRepository.findAll();
        
        com.example.orderservice.dtos.AdminStatsDto stats = new com.example.orderservice.dtos.AdminStatsDto();
        
        // Total orders
        stats.setTotalOrders(allOrders.size());
        
        // Orders by status
        stats.setOrdersPreparing(allOrders.stream()
                .filter(o -> OrderStatus.PREPARING.equals(o.getStatus()))
                .count());
        
        stats.setOrdersOutForDelivery(allOrders.stream()
                .filter(o -> OrderStatus.DELIVERING.equals(o.getStatus()) || 
                            OrderStatus.READY_FOR_PICKUP.equals(o.getStatus()))
                .count());
        
        stats.setOrdersDelivered(allOrders.stream()
                .filter(o -> OrderStatus.DELIVERED.equals(o.getStatus()))
                .count());
        
        stats.setOrdersCompleted(allOrders.stream()
                .filter(o -> OrderStatus.COMPLETED.equals(o.getStatus()))
                .count());
        
        stats.setOrdersCancelled(allOrders.stream()
                .filter(o -> OrderStatus.CANCELLED.equals(o.getStatus()))
                .count());
        
        // Today's orders (simple version - counts all orders for now)
        stats.setTodayOrders(allOrders.size());
        stats.setTodayRevenue(allOrders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum());
        
        // Week's orders
        stats.setWeekOrders(allOrders.size());
        stats.setWeekRevenue(stats.getTodayRevenue());
        
        // Note: Customer, Driver, Restaurant counts need to be fetched from other services
        // For now, set to 0 - frontend can call those services separately
        stats.setTotalCustomers(0);
        stats.setTotalDrivers(0);
        stats.setTotalRestaurants(0);
        
        return stats;
    }
}
