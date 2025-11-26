package com.example.userservice.dtos;

import lombok.Data;

@Data
public class UpdateProfileRequestDto {
    private String phoneNumber;
    private String address;
    private String vehicle;  // Driver-specific
    private String cne;      // Driver-specific (National ID)
}
