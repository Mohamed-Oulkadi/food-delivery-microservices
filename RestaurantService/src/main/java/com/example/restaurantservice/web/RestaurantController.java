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
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable String restaurantId) {
        Long id = parseIdOrThrow(restaurantId, "restaurantId");
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    // ▼▼▼ NEW METHOD ▼▼▼
    /**
     * PUT /restaurants/{restaurantId} - Update an existing restaurant
     */
    @PutMapping("/{restaurantId}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable String restaurantId, @RequestBody RestaurantDto restaurantDto) {
        Long id = parseIdOrThrow(restaurantId, "restaurantId");
        Restaurant updatedRestaurant = restaurantService.updateRestaurant(id, restaurantDto);
        return ResponseEntity.ok(updatedRestaurant);
    }

    // ▼▼▼ NEW METHOD ▼▼▼
    /**
     * DELETE /restaurants/{restaurantId} - Delete a restaurant
     */
    @DeleteMapping("/{restaurantId}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable String restaurantId) {
        Long id = parseIdOrThrow(restaurantId, "restaurantId");
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build(); // Returns HTTP 204 No Content
    }

    // GET /restaurants/{restaurantId}/menu - Get a restaurant's menu
    @GetMapping("/{restaurantId}/menu")
    public ResponseEntity<Menu> getMenu(@PathVariable String restaurantId) {
        Long id = parseIdOrThrow(restaurantId, "restaurantId");
        Menu menu = restaurantService.getRestaurantMenu(id);
        return ResponseEntity.ok(menu);
    }

    // POST /restaurants/{restaurantId}/menu/items - Add an item to a menu
    @PostMapping("/{restaurantId}/menu/items")
    public ResponseEntity<MenuItem> addMenuItem(@PathVariable String restaurantId, @RequestBody MenuItemDto menuItemDto) {
        Long id = parseIdOrThrow(restaurantId, "restaurantId");
        MenuItem newItem = restaurantService.addMenuItemToMenu(id, menuItemDto);
        return new ResponseEntity<>(newItem, HttpStatus.CREATED);
    }

    // Helper to parse String id and throw a 400 with clear message when invalid
    private Long parseIdOrThrow(String idValue, String paramName) {
        try {
            return Long.parseLong(idValue);
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    String.format("Parameter '%s' must be a number; received '%s'", paramName, idValue));
        }
    }

    // PUT /orders/{orderId}/status - Update an order's status
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body("Status is required.");
        }
        String result = restaurantService.updateOrderStatus(orderId, newStatus);
        return ResponseEntity.ok(result);
    }
}
