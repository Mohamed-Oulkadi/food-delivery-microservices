package com.example.orderservice.services;

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

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

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

        return orderRepository.save(order);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Return all orders (useful for quick testing / admin views)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        if (customerId == null) return List.of();
        return orderRepository.findByUserId(customerId);
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
}
