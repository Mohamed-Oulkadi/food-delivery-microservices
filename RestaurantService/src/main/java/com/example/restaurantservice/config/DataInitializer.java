package com.example.restaurantservice.config;

import com.example.restaurantservice.entities.Menu;
import com.example.restaurantservice.entities.MenuItem;
import com.example.restaurantservice.entities.Restaurant;
import com.example.restaurantservice.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor // Lombok annotation to create a constructor for final fields
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    private final RestaurantRepository restaurantRepository;

    @Override
    public void run(String... args) throws Exception {
        logger.info("DataInitializer is running...");
        // We only add data if the repository is empty, to avoid duplicates on every restart
        if (restaurantRepository.count() == 0) {
            System.out.println("No data found. Seeding database...");

            // Restaurant 1: Italian Place
            Restaurant italianPlace = new Restaurant();
            italianPlace.setName("Amici's Italian Kitchen");
            italianPlace.setCuisineType("Italian");
            italianPlace.setImageUrl("https://i.imgur.com/02j3h3s.jpeg");

            Menu italianMenu = new Menu();
            italianMenu.setItems(new ArrayList<>(List.of(
                    createMenuItem("Margherita Pizza", "Classic tomato, mozzarella, basil", 12.50, "https://i.imgur.com/iFa2D8C.jpeg"),
                    createMenuItem("Spaghetti Carbonara", "Pasta with egg, cheese, and pancetta", 15.00, "https://i.imgur.com/p9f2X6I.jpeg"),
                    createMenuItem("Lasagna", "Layers of pasta, meat sauce, and cheese", 14.00, "https://i.imgur.com/iFa2D8C.jpeg")
            )));
            italianPlace.setMenu(italianMenu);

            // Restaurant 2: Burger Joint
            Restaurant burgerJoint = new Restaurant();
            burgerJoint.setName("The Burger Barn");
            burgerJoint.setCuisineType("American");
            burgerJoint.setImageUrl("https://i.imgur.com/t4f3y0i.jpeg");

            Menu burgerMenu = new Menu();
            burgerMenu.setItems(new ArrayList<>(List.of(
                    createMenuItem("Classic Cheeseburger", "Beef patty with cheddar cheese", 10.50, "https://i.imgur.com/223c3f4.jpeg"),
                    createMenuItem("Spicy Chicken Sandwich", "Fried chicken with spicy mayo", 11.00, "https://i.imgur.com/s7f4sE1.jpeg"),
                    createMenuItem("Fries", "Golden crispy fries", 4.00, "https://i.imgur.com/s7f4sE1.jpeg")
            )));
            burgerJoint.setMenu(burgerMenu);

            // Restaurant 3: Mexican Place
            Restaurant mexicanPlace = new Restaurant();
            mexicanPlace.setName("Taco Fiesta");
            mexicanPlace.setCuisineType("Mexican");
            mexicanPlace.setImageUrl("https://i.imgur.com/P3Sj9oA.jpeg");

            Menu mexicanMenu = new Menu();
            mexicanMenu.setItems(new ArrayList<>(List.of(
                    createMenuItem("Tacos al Pastor", "Marinated pork tacos", 9.50, "https://i.imgur.com/P3Sj9oA.jpeg"),
                    createMenuItem("Burrito Bowl", "Your choice of protein with rice, beans, and toppings", 12.00, "https://i.imgur.com/P3Sj9oA.jpeg"),
                    createMenuItem("Quesadilla", "Grilled tortilla with cheese and fillings", 8.00, "https://i.imgur.com/P3Sj9oA.jpeg")
            )));
            mexicanPlace.setMenu(mexicanMenu);

            // Restaurant 4: Sushi Place
            Restaurant sushiPlace = new Restaurant();
            sushiPlace.setName("Sushi Express");
            sushiPlace.setCuisineType("Japanese");
            sushiPlace.setImageUrl("https://i.imgur.com/P3Sj9oA.jpeg");

            Menu sushiMenu = new Menu();
            sushiMenu.setItems(new ArrayList<>(List.of(
                    createMenuItem("California Roll", "Crab, avocado, and cucumber", 8.00, "https://i.imgur.com/P3Sj9oA.jpeg"),
                    createMenuItem("Spicy Tuna Roll", "Tuna with spicy mayo", 9.00, "https://i.imgur.com/P3Sj9oA.jpeg"),
                    createMenuItem("Salmon Nigiri", "Slice of salmon over rice", 6.00, "https://i.imgur.com/P3Sj9oA.jpeg")
            )));
            sushiPlace.setMenu(sushiMenu);

            // Save all new restaurants to the database
            restaurantRepository.saveAll(List.of(italianPlace, burgerJoint, mexicanPlace, sushiPlace));

            System.out.println("Database seeded with 4 restaurants.");
        } else {
            System.out.println("Database already contains data. Skipping seeding.");
        }
    }

    /**
     * A helper method to quickly create MenuItem objects.
     */
    private MenuItem createMenuItem(String name, String description, double price, String imageUrl) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setImageUrl(imageUrl);
        item.setAvailable(true);
        return item;
    }
}
