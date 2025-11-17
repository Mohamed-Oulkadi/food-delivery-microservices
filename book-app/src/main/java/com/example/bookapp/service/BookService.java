package com.example.bookapp.service;

import com.example.bookapp.model.Book;
import com.example.bookapp.model.Category;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service // [cite: 91]
public class BookService {
    private final Map<String, Book> books = new ConcurrentHashMap<>(); // [cite: 93]

    @PostConstruct // [cite: 94]
    public void init() { // Données initiales [cite: 95]
        books.put("1", new Book("1", "Java Programming", "John Doe", 49.99,
                "1234560", Category.TECHNOLOGY)); // [cite: 96-97]

        // Code corrigé de
        books.put("2", new Book("2", "Science Fiction", "Jane Smith", 29.99,
                "0987321", Category.FICTION));

        books.put("3", new Book("3", "World History", "Bob Johnson", 39.99,
                "1122455", Category.HISTORY)); // [cite: 101-102]
    }

    public List<Book> getAllBooks() { // [cite: 104]
        return new ArrayList<>(books.values()); // [cite: 105]
    }

    public Book getBookById(String id) { // [cite: 107]
        return books.get(id);
    }

    public Book createBook(String title, String author, Double price,
                           String isbn, Category category) { // [cite: 109-110]
        String id = UUID.randomUUID().toString(); // [cite: 111-112]
        Book book = new Book(id, title, author, price, isbn, category); // [cite: 113-114]
        books.put(id, book); // [cite: 115]
        return book; // [cite: 116]
    }

    public Book updateBook(String id, String title, String author, Double price,
                           String isbn, Category category) { // [cite: 118-119]
        Book book = books.get(id); // [cite: 120]
        if (book != null) { // [cite: 121]
            if (title != null) book.setTitle(title); // [cite: 122]
            if (author != null) book.setAuthor(author); // [cite: 123]
            if (price != null) book.setPrice(price); // [cite: 124]
            if (isbn != null) book.setIsbn(isbn); // [cite: 125]
            if (category != null) book.setCategory(category); // [cite: 126]
        }
        return book; // [cite: 127]
    }

    public boolean deleteBook(String id) { // [cite: 129]
        return books.remove(id) != null;
    }

    public List<Book> searchBooksByTitle(String title) { // [cite: 131]
        return books.values().stream().filter(book ->
                book.getTitle().toLowerCase().contains(title.toLowerCase())).toList(); // [cite: 132]
    }

    public List<Book> getBooksByCategory(Category category) { // [cite: 135]
        return books.values().stream().filter(book -> book.getCategory() ==
                category).toList(); // [cite: 136]
    }
}