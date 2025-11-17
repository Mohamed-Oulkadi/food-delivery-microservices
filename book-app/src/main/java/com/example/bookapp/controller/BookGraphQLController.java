package com.example.bookapp.controller;

import com.example.bookapp.model.Book;
import com.example.bookapp.model.Category;
import com.example.bookapp.service.BookService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller // [cite: 149]
public class BookGraphQLController {

    private final BookService bookService; // [cite: 151]

    // Constructeur corrigé de [cite: 152-155]
    public BookGraphQLController(BookService bookService) {
        this.bookService = bookService;
    }

    @QueryMapping // [cite: 154]
    public List<Book> getAllBooks() { // [cite: 156]
        return bookService.getAllBooks(); // [cite: 157]
    }

    @QueryMapping // [cite: 158]
    public Book getBookById(@Argument String id) { // [cite: 159]
        return bookService.getBookById(id); // [cite: 160]
    }

    @QueryMapping // [cite: 161]
    public List<Book> getBooksByCategory(@Argument Category category) { // [cite: 162]
        return bookService.getBooksByCategory(category); // [cite: 163]
    }

    @QueryMapping // [cite: 164]
    public List<Book> searchBooks(@Argument String title) { // [cite: 165]
        return bookService.searchBooksByTitle(title);
    }

    @MutationMapping // [cite: 166]
    public Book createBook(
            @Argument String title, // [cite: 168]
            @Argument String author, // [cite: 169]
            @Argument Double price, // [cite: 170]
            @Argument String isbn, // [cite: 171]
            @Argument Category category) { // [cite: 172]
        return bookService.createBook(title, author, price, isbn, category); // [cite: 173]
    }

    @MutationMapping // [cite: 175]
    public Book updateBook(
            @Argument String id, // [cite: 177]
            @Argument String title, // [cite: 178]
            @Argument String author, // [cite: 179]
            @Argument Double price, // [cite: 180]
            @Argument String isbn, // [cite: 181]
            @Argument Category category) { // [cite: 182]
        return bookService.updateBook(id, title, author, price, isbn, category); // [cite: 183-184]
    }

    @MutationMapping // [cite: 185]
    public Boolean deleteBook(@Argument String id) { // [cite: 186]
        return bookService.deleteBook(id); // [cite: 187]
    }
}