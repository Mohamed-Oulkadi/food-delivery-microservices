package com.example.demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.*;
import com.example.demo.service.LivreurService;

import java.util.List;

@RestController
@RequestMapping("/api/livreurs")
@RequiredArgsConstructor
public class LivreurController {

    private final LivreurService livreurService;

    // Inscription d'un livreur
    @PostMapping("/register")
    public ResponseEntity<LivreurResponseDTO> register(@RequestBody LivreurRegisterDTO dto) {
        LivreurResponseDTO response = livreurService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Récupérer un livreur par ID
    @GetMapping("/{id}")
    public ResponseEntity<LivreurResponseDTO> getLivreur(@PathVariable Long id) {
        LivreurResponseDTO response = livreurService.getLivreur(id);
        return ResponseEntity.ok(response);
    }

    // Mettre à jour le profil d'un livreur
    @PutMapping("/{id}")
    public ResponseEntity<LivreurResponseDTO> updateProfile(
            @PathVariable Long id,
            @RequestBody LivreurUpdateDTO dto) {
        LivreurResponseDTO response = livreurService.updateProfile(id, dto);
        return ResponseEntity.ok(response);
    }

    // Supprimer un livreur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivreur(@PathVariable Long id) {
        livreurService.deleteLivreur(id);
        return ResponseEntity.noContent().build();
    }

    // Changer la disponibilité d'un livreur
    @PutMapping("/{id}/disponibilite")
    public ResponseEntity<LivreurResponseDTO> changeDisponibilite(
            @PathVariable Long id,
            @RequestBody DisponibiliteDTO dto) {
        LivreurResponseDTO response = livreurService.changeDisponibilite(id, dto);
        return ResponseEntity.ok(response);
    }

    // Liste des livreurs disponibles (optionnel par zone)
    @GetMapping("/disponibles")
    public ResponseEntity<List<LivreurResponseDTO>> getLivreursDisponibles(
            @RequestParam(required = false) String zone) {
        List<LivreurResponseDTO> response = livreurService.getLivreursDisponibles(zone);
        return ResponseEntity.ok(response);
    }

    // Historique des livraisons d'un livreur
    @GetMapping("/{id}/livraisons")
    public ResponseEntity<List<LivraisonResponseDTO>> getHistoriqueLivraisons(@PathVariable Long id) {
        List<LivraisonResponseDTO> response = livreurService.getHistoriqueLivraisons(id);
        return ResponseEntity.ok(response);
    }

    // Livraisons en cours
    @GetMapping("/{id}/livraisons/encours")
    public ResponseEntity<List<LivraisonResponseDTO>> getLivraisonsEnCours(@PathVariable Long id) {
        List<LivraisonResponseDTO> response = livreurService.getLivraisonsEnCours(id);
        return ResponseEntity.ok(response);
    }

    // Accepter une livraison
    @PostMapping("/{id}/livraisons/{livraisonId}/accepter")
    public ResponseEntity<LivraisonResponseDTO> accepterLivraison(
            @PathVariable Long id,
            @PathVariable Long livraisonId) {
        LivraisonResponseDTO response = livreurService.accepterLivraison(id, livraisonId);
        return ResponseEntity.ok(response);
    }

    // Démarrer une livraison
    @PostMapping("/{id}/livraisons/{livraisonId}/demarrer")
    public ResponseEntity<LivraisonResponseDTO> demarrerLivraison(
            @PathVariable Long id,
            @PathVariable Long livraisonId) {
        LivraisonResponseDTO response = livreurService.demarrerLivraison(id, livraisonId);
        return ResponseEntity.ok(response);
    }

    // Terminer une livraison
    @PostMapping("/{id}/livraisons/{livraisonId}/terminer")
    public ResponseEntity<LivraisonResponseDTO> terminerLivraison(
            @PathVariable Long id,
            @PathVariable Long livraisonId) {
        LivraisonResponseDTO response = livreurService.terminerLivraison(id, livraisonId);
        return ResponseEntity.ok(response);
    }

    // Statistiques du livreur
    @GetMapping("/{id}/statistiques")
    public ResponseEntity<StatistiquesDTO> getStatistiques(@PathVariable Long id) {
        StatistiquesDTO response = livreurService.getStatistiques(id);
        return ResponseEntity.ok(response);
    }

    // Gains du livreur
    @GetMapping("/{id}/gains")
    public ResponseEntity<GainsDTO> getGains(@PathVariable Long id) {
        GainsDTO response = livreurService.getGains(id);
        return ResponseEntity.ok(response);
    }
}
