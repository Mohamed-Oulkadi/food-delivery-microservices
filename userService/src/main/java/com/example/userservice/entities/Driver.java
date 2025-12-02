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
    
    private String vehicle;
    private String cnie; // CNIE - Carte Nationale d'Identité Électronique (National ID Card)
    
    /**
     * Check if the driver's profile is complete.
     * A driver must have all required fields filled to accept orders.
     */
    public boolean isProfileComplete() {
        return getPhoneNumber() != null && !getPhoneNumber().trim().isEmpty()
                && getAddress() != null && !getAddress().trim().isEmpty()
                && vehicle != null && !vehicle.trim().isEmpty()
                && cnie != null && !cnie.trim().isEmpty();
    }
}
