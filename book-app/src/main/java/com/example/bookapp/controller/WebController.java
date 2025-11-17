package com.example.bookapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // [cite: 233]
public class WebController {

    @GetMapping("/") // [cite: 235]
    public String index(Model model) { // [cite: 236]
        model.addAttribute("pageTitle", "Gestionnaire de Livres"); // [cite: 237]
        return "index"; // [cite: 237]
    }

    @GetMapping("/graphql-ui") // [cite: 239]
    public String graphqlUI() { // [cite: 240]
        return "graphql-ui";
    }
}