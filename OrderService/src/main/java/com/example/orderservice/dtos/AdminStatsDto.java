package com.example.orderservice.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDto {
    private long totalCustomers;
    private long totalDrivers;
    private long totalRestaurants;
    private long totalOrders;
    
    // Orders by status
    private long ordersPreparing;
    private long ordersOutForDelivery; // IN_TRANSIT, PICKED_UP
    private long ordersDelivered;
    private long ordersCompleted;
    private long ordersCancelled;
    
    // Today's stats
    private long todayOrders;
    private double todayRevenue;
    
    // This week stats
    private long weekOrders;
    private double weekRevenue;
}
