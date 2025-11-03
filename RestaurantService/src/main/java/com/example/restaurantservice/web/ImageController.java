package com.example.restaurantservice.web;

import com.example.restaurantservice.services.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/image")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping
    public ResponseEntity<String> uploadImage(@PathVariable Long restaurantId, @RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = imageService.uploadImage(restaurantId, file);
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload image");
        }
    }

    @PostMapping("/menu-items/{menuItemId}/image")
    public ResponseEntity<String> uploadMenuItemImage(@PathVariable Long menuItemId, @RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = imageService.uploadMenuItemImage(menuItemId, file);
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload image");
        }
    }
}
