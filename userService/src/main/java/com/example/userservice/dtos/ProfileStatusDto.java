package com.example.userservice.dtos;

import lombok.Data;

@Data
public class ProfileStatusDto {
    private boolean profileComplete;
    private String message;
    
    public ProfileStatusDto(boolean profileComplete, String message) {
        this.profileComplete = profileComplete;
        this.message = message;
    }
}
