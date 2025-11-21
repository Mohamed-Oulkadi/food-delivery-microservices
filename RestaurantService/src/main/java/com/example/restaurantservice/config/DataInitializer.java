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
            italianPlace.setImageUrl("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80");
            italianPlace.setRating(4.5);
            italianPlace.setDeliveryTime("30-40 min");
            italianPlace.setAddress("123 Main St, Anytown, CA 90210");
            italianPlace.setPhoneNumber("(555) 123-4567");

            Menu italianMenu = new Menu();
            italianMenu.setItems(new ArrayList<>(List.of(
            createMenuItem("Margherita Pizza", "Classic tomato, mozzarella, basil", 12.50, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80"),
            createMenuItem("Spaghetti Carbonara", "Pasta with egg, cheese, and pancetta", 15.00, "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80"),
            createMenuItem("Lasagna", "Layers of pasta, meat sauce, and cheese", 14.00, "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80")
            )));
            italianPlace.setMenu(italianMenu);

            // Restaurant 2: Burger Joint
            Restaurant burgerJoint = new Restaurant();
            burgerJoint.setName("The Burger Barn");
            burgerJoint.setCuisineType("American");
            burgerJoint.setImageUrl("https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80");
            burgerJoint.setRating(4.3);
            burgerJoint.setDeliveryTime("20-30 min");
            burgerJoint.setAddress("456 Oak Ave, Anytown, CA 90210");
            burgerJoint.setPhoneNumber("(555) 234-5678");

            Menu burgerMenu = new Menu();
            burgerMenu.setItems(new ArrayList<>(List.of(
            createMenuItem("Classic Cheeseburger", "Beef patty with cheddar cheese", 10.50, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"),
            createMenuItem("Spicy Chicken Sandwich", "Fried chicken with spicy mayo", 11.00, "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80"),
            createMenuItem("Fries", "Golden crispy fries", 4.00, "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80")
            )));
            burgerJoint.setMenu(burgerMenu);

            // Restaurant 3: Mexican Place
            Restaurant mexicanPlace = new Restaurant();
            mexicanPlace.setName("Taco Fiesta");
            mexicanPlace.setCuisineType("Mexican");
            mexicanPlace.setImageUrl("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80");
            mexicanPlace.setRating(4.6);
            mexicanPlace.setDeliveryTime("25-35 min");
            mexicanPlace.setAddress("789 Pine Ln, Anytown, CA 90210");
            mexicanPlace.setPhoneNumber("(555) 345-6789");

            Menu mexicanMenu = new Menu();
            mexicanMenu.setItems(new ArrayList<>(List.of(
            createMenuItem("Tacos al Pastor", "Marinated pork tacos", 9.50, "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80"),
            createMenuItem("Burrito Bowl", "Your choice of protein with rice, beans, and toppings", 12.00, "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80"),
            createMenuItem("Quesadilla", "Grilled tortilla with cheese and fillings", 8.00, "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&q=80")
            )));
            mexicanPlace.setMenu(mexicanMenu);

            // Restaurant 4: Sushi Place
            Restaurant sushiPlace = new Restaurant();
            sushiPlace.setName("Sushi Express");
            sushiPlace.setCuisineType("Japanese");
            sushiPlace.setImageUrl("https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80");
            sushiPlace.setRating(4.8);
            sushiPlace.setDeliveryTime("35-45 min");
            sushiPlace.setAddress("101 Cedar Blvd, Anytown, CA 90210");
            sushiPlace.setPhoneNumber("(555) 456-7890");

            Menu sushiMenu = new Menu();
            sushiMenu.setItems(new ArrayList<>(List.of(
            createMenuItem("California Roll", "Crab, avocado, and cucumber", 8.00, "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80"),
            createMenuItem("Spicy Tuna Roll", "Tuna with spicy mayo", 9.00, "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80"),
            createMenuItem("Salmon Nigiri", "Slice of salmon over rice", 6.00, "https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=800&q=80")
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
