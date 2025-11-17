package com.example.bookapp.model;

// [cite: 51-81]
public class Book {
    private String id;
    private String title;
    private String author;
    private Double price;
    private String isbn;
    private Category category;

    public Book() {} // [cite: 59]

    public Book(String id, String title, String author, Double price,
                String isbn, Category category) {
        this.id = id; // Corrigé de
        this.title = title; // [cite: 63]
        this.author = author; // [cite: 64]
        this.price = price; // [cite: 65]
        this.isbn = isbn; // [cite: 66]
        this.category = category; // [cite: 67]
    }

    // Getters et Setters [cite: 68-81]
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}