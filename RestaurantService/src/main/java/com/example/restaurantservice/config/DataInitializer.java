package com.example.restaurantservice.config;

import com.example.restaurantservice.entities.Menu;
import com.example.restaurantservice.entities.MenuItem;
import com.example.restaurantservice.entities.Restaurant;
import com.example.restaurantservice.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor // Lombok annotation to create a constructor for final fields
public class DataInitializer implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;

    @Override
    public void run(String... args) throws Exception {
        // We only add data if the repository is empty, to avoid duplicates on every restart
        if (restaurantRepository.count() == 0) {
            System.out.println("No data found. Seeding database...");

            // Restaurant 1: Italian Place
            Restaurant italianPlace = new Restaurant();
            italianPlace.setName("Amici's Italian Kitchen");
            italianPlace.setCuisineType("Italian");

            Menu italianMenu = new Menu();
            italianMenu.setItems(new ArrayList<>(List.of(
                    createMenuItem("Margherita Pizza", "Classic tomato, mozzarella, basil", 12.50),
                    createMenuItem("Spaghetti Carbonara", "Pasta with egg, cheese, and pancetta", 15.00)
            )));
            italianPlace.setMenu(italianMenu);

            // Restaurant 2: Burger Joint
            Restaurant burgerJoint = new Restaurant();
            burgerJoint.setName("The Burger Barn");
            burgerJoint.setCuisineType("American");

            Menu burgerMenu = new Menu();
            burgerMenu.setItems(new ArrayList<>(List.of(
                    createMenuItem("Classic Cheeseburger", "Beef patty with cheddar cheese", 10.50),
                    createMenuItem("Spicy Chicken Sandwich", "Fried chicken with spicy mayo", 11.00),
                    createMenuItem("Fries", "Golden crispy fries", 4.00)
            )));
            burgerJoint.setMenu(burgerMenu);

            // Save all new restaurants to the database
            restaurantRepository.saveAll(List.of(italianPlace, burgerJoint));

            System.out.println("Database seeded with 2 restaurants.");
        } else {
            System.out.println("Database already contains data. Skipping seeding.");
        }
    }

    /**
     * A helper method to quickly create MenuItem objects.
     */
    private MenuItem createMenuItem(String name, String description, double price) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setAvailable(true);
        return item;
    }
}
