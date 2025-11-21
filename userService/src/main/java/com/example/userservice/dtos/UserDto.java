package com.example.userservice.dtos;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String phoneNumber;
    private String address;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
