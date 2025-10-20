package com.example.restaurantservice.services;

import com.example.restaurantservice.dtos.MenuItemDto;
import com.example.restaurantservice.dtos.RestaurantDto;
import com.example.restaurantservice.entities.Menu;
import com.example.restaurantservice.entities.MenuItem;
import com.example.restaurantservice.entities.Restaurant;
import com.example.restaurantservice.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    @Transactional
    public Restaurant createRestaurant(RestaurantDto restaurantDto) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantDto.getName());
        restaurant.setCuisineType(restaurantDto.getCuisineType());

        // Create an empty menu for the new restaurant
        Menu menu = new Menu();
        menu.setItems(new ArrayList<>());
        restaurant.setMenu(menu);

        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(UUID restaurantId) {
        return restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));
    }

    public Menu getRestaurantMenu(UUID restaurantId) {
        return getRestaurantById(restaurantId).getMenu();
    }

    @Transactional
    public MenuItem addMenuItemToMenu(UUID restaurantId, MenuItemDto menuItemDto) {
        Restaurant restaurant = getRestaurantById(restaurantId);

        MenuItem newItem = new MenuItem();
        newItem.setName(menuItemDto.getName());
        newItem.setDescription(menuItemDto.getDescription());
        newItem.setPrice(menuItemDto.getPrice());
        newItem.setAvailable(menuItemDto.isAvailable());

        restaurant.getMenu().getItems().add(newItem);
        restaurantRepository.save(restaurant); // The cascade will save the new item

        return newItem;
    }

    // This is a simplified version. In a real application, you might communicate with an Order Service.
    public String updateOrderStatus(UUID orderId, String status) {
        System.out.printf("Updating status for order %s to %s%n", orderId, status);
        // Business logic to update order status would go here.
        return String.format("Order %s status updated to %s", orderId, status);
    }
}
