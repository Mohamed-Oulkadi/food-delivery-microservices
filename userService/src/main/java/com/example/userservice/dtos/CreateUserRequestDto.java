package com.example.userservice.dtos;

import lombok.Data;

@Data
public class CreateUserRequestDto {
    private String username;
    private String email;
    private String password;
    private String role;
    private String phoneNumber;
    private String address;
}