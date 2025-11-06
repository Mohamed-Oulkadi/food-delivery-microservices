package com.example.userservice.config;

import com.example.userservice.dtos.CreateUserRequestDto;
import com.example.userservice.repositories.UserRepository;
import com.example.userservice.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("Seeding User database...");

            // Create an Admin User
            CreateUserRequestDto adminRequest = new CreateUserRequestDto();
            adminRequest.setUsername("admin");
            adminRequest.setEmail("admin@expressfood.com");
            adminRequest.setPassword("admin123");
            adminRequest.setRole("ROLE_ADMIN");
            userService.createUser(adminRequest);

            // Create a Customer User
            CreateUserRequestDto customerRequest = new CreateUserRequestDto();
            customerRequest.setUsername("customer");
            customerRequest.setEmail("customer@example.com");
            customerRequest.setPassword("customer123");
            customerRequest.setRole("ROLE_CUSTOMER");
            userService.createUser(customerRequest);

            // Create a Customer Driver
            CreateUserRequestDto driverRequest = new CreateUserRequestDto();
            driverRequest.setUsername("driver");
            driverRequest.setEmail("driver@example.com");
            driverRequest.setPassword("driver123");
            driverRequest.setRole("ROLE_DRIVER");
            userService.createUser(driverRequest);


            System.out.println("User database seeded with 3 users.");
        }
    }
}
