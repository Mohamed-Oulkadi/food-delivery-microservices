package com.example.restaurantservice.services;

import com.example.restaurantservice.entities.MenuItem;
import com.example.restaurantservice.entities.Restaurant;
import com.example.restaurantservice.repository.MenuItemRepository;
import com.example.restaurantservice.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public ImageService(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public String uploadImage(Long restaurantId, MultipartFile file) throws IOException {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        String fileUrl = saveFile(file);
        restaurant.setImageUrl(fileUrl);
        restaurantRepository.save(restaurant);

        return fileUrl;
    }

    public String uploadMenuItemImage(Long menuItemId, MultipartFile file) throws IOException {
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        String fileUrl = saveFile(file);
        menuItem.setImageUrl(fileUrl);
        menuItemRepository.save(menuItem);

        return fileUrl;
    }

    private String saveFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String filename = UUID.randomUUID().toString() + "." + originalFilename.substring(originalFilename.lastIndexOf(".") + 1);

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        return "/uploads/images/" + filename;
    }
}
