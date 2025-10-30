package com.example.orderservice.dtos;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class OrderRequestDto {
    private Long userId;
    private Long restaurantId;
    private List<OrderItemDto> items;
}
