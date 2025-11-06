package com.example.orderservice.dtos;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDto {
    // Accept string IDs from the frontend (which may send UUIDs or numeric strings).
    private Long customerId;
    private Long restaurantId;
    private List<OrderItemDto> items;
}
