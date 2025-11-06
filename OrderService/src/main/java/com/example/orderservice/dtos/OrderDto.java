package com.example.orderservice.dtos;

import com.example.orderservice.entities.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private Long customerId;
    private Long restaurantId;
    private List<OrderItemDto> items;
    private double totalAmount;
    private OrderStatus status;
    private LocalDateTime date;
}
