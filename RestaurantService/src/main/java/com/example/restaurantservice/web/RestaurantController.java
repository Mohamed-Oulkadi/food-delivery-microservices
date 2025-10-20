package com.example.restaurantservice.web;

import com.example.restaurantservice.dtos.MenuItemDto;
import com.example.restaurantservice.dtos.RestaurantDto;
import com.example.restaurantservice.entities.Menu;
import com.example.restaurantservice.entities.MenuItem;
import com.example.restaurantservice.entities.Restaurant;
import com.example.restaurantservice.services.RestaurantService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/restaurants")
@AllArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    // POST /restaurants - Create a new restaurant
    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody RestaurantDto restaurantDto) {
        Restaurant createdRestaurant = restaurantService.createRestaurant(restaurantDto);
        return new ResponseEntity<>(createdRestaurant, HttpStatus.CREATED);
    }

    // GET /restaurants - Get all restaurants
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    // GET /restaurants/{restaurantId} - Get a specific restaurant
    @GetMapping("/{restaurantId}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable UUID restaurantId) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(restaurantId));
    }

    // ▼▼▼ NEW METHOD ▼▼▼
    /**
     * PUT /restaurants/{restaurantId} - Update an existing restaurant
     */
    @PutMapping("/{restaurantId}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable UUID restaurantId, @RequestBody RestaurantDto restaurantDto) {
        Restaurant updatedRestaurant = restaurantService.updateRestaurant(restaurantId, restaurantDto);
        return ResponseEntity.ok(updatedRestaurant);
    }

    // ▼▼▼ NEW METHOD ▼▼▼
    /**
     * DELETE /restaurants/{restaurantId} - Delete a restaurant
     */
    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable UUID restaurantId) {
        restaurantService.deleteRestaurant(restaurantId);
        return ResponseEntity.noContent().build(); // Returns HTTP 204 No Content
    }

    // GET /restaurants/{restaurantId}/menu - Get a restaurant's menu
    @GetMapping("/{restaurantId}/menu")
    public ResponseEntity<Menu> getMenu(@PathVariable UUID restaurantId) {
        Menu menu = restaurantService.getRestaurantMenu(restaurantId);
        return ResponseEntity.ok(menu);
    }

    // POST /restaurants/{restaurantId}/menu/items - Add an item to a menu
    @PostMapping("/{restaurantId}/menu/items")
    public ResponseEntity<MenuItem> addMenuItem(@PathVariable UUID restaurantId, @RequestBody MenuItemDto menuItemDto) {
        MenuItem newItem = restaurantService.addMenuItemToMenu(restaurantId, menuItemDto);
        return new ResponseEntity<>(newItem, HttpStatus.CREATED);
    }

    // PUT /orders/{orderId}/status - Update an order's status
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable UUID orderId, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status is required.");
        }
        String result = restaurantService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(result);
    }
}
