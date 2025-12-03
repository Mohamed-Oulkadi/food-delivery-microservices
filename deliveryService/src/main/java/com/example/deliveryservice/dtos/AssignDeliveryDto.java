package com.example.deliveryservice.dtos;

import lombok.Data;

@Data
public class AssignDeliveryDto {
    private Long driverId;

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }
}

