package com.example.userservice.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("DRIVER")
@Data
@EqualsAndHashCode(callSuper = true)
public class Driver extends User {
    
    private String phoneNumber;
    private String address;
    private String vehicle;
    private String cne; // Code National (National ID Card)
    
    /**
     * Check if the driver's profile is complete.
     * A driver must have all required fields filled to accept orders.
     */
    public boolean isProfileComplete() {
        return phoneNumber != null && !phoneNumber.trim().isEmpty()
                && address != null && !address.trim().isEmpty()
                && vehicle != null && !vehicle.trim().isEmpty()
                && cne != null && !cne.trim().isEmpty();
    }
}
