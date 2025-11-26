package com.example.restaurantservice.services;

import com.example.restaurantservice.dtos.MenuItemDto;
import com.example.restaurantservice.dtos.RestaurantDto;
import com.example.restaurantservice.entities.Menu;
import com.example.restaurantservice.entities.MenuItem;
import com.example.restaurantservice.entities.Restaurant;
import com.example.restaurantservice.repository.RestaurantRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public Restaurant createRestaurant(RestaurantDto restaurantDto) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantDto.getName());
        restaurant.setCuisineType(restaurantDto.getCuisineType());
        restaurant.setImageUrl(restaurantDto.getImageUrl());
        restaurant.setRating(restaurantDto.getRating());
        restaurant.setDeliveryTime(restaurantDto.getDeliveryTime());
        restaurant.setAddress(restaurantDto.getAddress());
        restaurant.setPhoneNumber(restaurantDto.getPhoneNumber());

        Menu menu = new Menu();
        menu.setItems(new ArrayList<>());
        restaurant.setMenu(menu);

        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(Long restaurantId) {
        return restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + restaurantId));
    }

    public Menu getRestaurantMenu(Long restaurantId) {
        return getRestaurantById(restaurantId).getMenu();
    }

    public MenuItem addMenuItemToMenu(Long restaurantId, MenuItemDto menuItemDto) {
        Restaurant restaurant = getRestaurantById(restaurantId);

        MenuItem newItem = new MenuItem();
        newItem.setName(menuItemDto.getName());
        newItem.setDescription(menuItemDto.getDescription());
        newItem.setPrice(menuItemDto.getPrice());
        newItem.setImageUrl(menuItemDto.getImageUrl());
        newItem.setAvailable(menuItemDto.isAvailable());

        restaurant.getMenu().getItems().add(newItem);
        // Saving the parent (Restaurant) will cascade and save the new MenuItem
        restaurantRepository.save(restaurant);

        return newItem;
    }

    public Restaurant updateRestaurant(Long restaurantId, RestaurantDto restaurantDto) {
        Restaurant existingRestaurant = getRestaurantById(restaurantId);
        existingRestaurant.setName(restaurantDto.getName());
        existingRestaurant.setCuisineType(restaurantDto.getCuisineType());
        existingRestaurant.setImageUrl(restaurantDto.getImageUrl());
        existingRestaurant.setRating(restaurantDto.getRating());
        existingRestaurant.setDeliveryTime(restaurantDto.getDeliveryTime());
        existingRestaurant.setAddress(restaurantDto.getAddress());
        existingRestaurant.setPhoneNumber(restaurantDto.getPhoneNumber());
        return restaurantRepository.save(existingRestaurant);
    }

    public void deleteRestaurant(Long restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new RuntimeException("Restaurant not found with id: " + restaurantId);
        }
        restaurantRepository.deleteById(restaurantId);
    }

    public String updateOrderStatus(Long orderId, String status) {
        // This is a placeholder for interaction with an Order Service
        System.out.printf("Updating status for order %s to %s%n", orderId, status);
        return String.format("Order %s status updated to %s", orderId, status);
    }

    public MenuItem updateMenuItem(Long restaurantId, Long menuItemId, MenuItemDto menuItemDto) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        Menu menu = restaurant.getMenu();
        
        MenuItem itemToUpdate = menu.getItems().stream()
                .filter(item -> item.getMenuItemId().equals(menuItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + menuItemId));
        
        itemToUpdate.setName(menuItemDto.getName());
        itemToUpdate.setDescription(menuItemDto.getDescription());
        itemToUpdate.setPrice(menuItemDto.getPrice());
        itemToUpdate.setImageUrl(menuItemDto.getImageUrl());
        itemToUpdate.setAvailable(menuItemDto.isAvailable());
        
        restaurantRepository.save(restaurant);
        return itemToUpdate;
    }

    public void deleteMenuItem(Long restaurantId, Long menuItemId) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        Menu menu = restaurant.getMenu();
        
        boolean removed = menu.getItems().removeIf(item -> item.getMenuItemId().equals(menuItemId));
        
        if (!removed) {
            throw new RuntimeException("Menu item not found with id: " + menuItemId);
        }
        
        restaurantRepository.save(restaurant);
    }
}