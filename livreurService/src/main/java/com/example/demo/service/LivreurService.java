package com.example.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.*;
import com.example.demo.entity.Livraison;
import com.example.demo.entity.Livreur;
import com.example.demo.repository.LivraisonRepository;
import com.example.demo.repository.LivreurRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LivreurService {

    private final LivreurRepository livreurRepository;
    private final LivraisonRepository livraisonRepository;

    // Créer un livreur
    public LivreurResponseDTO register(LivreurRegisterDTO dto) {
        if (livreurRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        Livreur livreur = new Livreur();
        livreur.setNom(dto.getNom());
        livreur.setPrenom(dto.getPrenom());
        livreur.setEmail(dto.getEmail());
        livreur.setTelephone(dto.getTelephone());
        livreur.setZoneActivite(dto.getZoneActivite());
        livreur.setIsDisponible(false);
        livreur.setTotalGains(BigDecimal.ZERO);

        livreur = livreurRepository.save(livreur);
        return mapToResponseDTO(livreur);
    }

    // Récupérer un livreur par ID
    public LivreurResponseDTO getLivreur(Long id) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));
        return mapToResponseDTO(livreur);
    }

    // Mettre à jour un livreur
    public LivreurResponseDTO updateProfile(Long id, LivreurUpdateDTO dto) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));

        livreur.setNom(dto.getNom());
        livreur.setPrenom(dto.getPrenom());
        livreur.setTelephone(dto.getTelephone());
        livreur.setZoneActivite(dto.getZoneActivite());

        livreur = livreurRepository.save(livreur);
        return mapToResponseDTO(livreur);
    }

    // Supprimer un livreur (marquer indisponible)
    public void deleteLivreur(Long id) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));
        livreur.setIsDisponible(false);
        livreurRepository.save(livreur);
    }

    // Changer la disponibilité
    public LivreurResponseDTO changeDisponibilite(Long id, DisponibiliteDTO dto) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));

        livreur.setIsDisponible(dto.getIsDisponible());
        livreur = livreurRepository.save(livreur);
        return mapToResponseDTO(livreur);
    }

    // Liste des livreurs disponibles
    public List<LivreurResponseDTO> getLivreursDisponibles(String zone) {
        List<Livreur> livreurs;
        if (zone != null && !zone.isEmpty()) {
            livreurs = livreurRepository.findByIsDisponibleTrueAndZoneActivite(zone);
        } else {
            livreurs = livreurRepository.findByIsDisponibleTrue();
        }
        return livreurs.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Historique des livraisons
    public List<LivraisonResponseDTO> getHistoriqueLivraisons(Long id) {
        List<Livraison> livraisons = livraisonRepository.findByLivreurId(id);
        return livraisons.stream()
                .map(this::mapToLivraisonResponseDTO)
                .collect(Collectors.toList());
    }

    // Livraisons en cours
    public List<LivraisonResponseDTO> getLivraisonsEnCours(Long id) {
        List<Livraison> livraisons = livraisonRepository.findByLivreurIdAndStatut(id, "EN_COURS");
        livraisons.addAll(livraisonRepository.findByLivreurIdAndStatut(id, "ACCEPTEE"));
        return livraisons.stream()
                .map(this::mapToLivraisonResponseDTO)
                .collect(Collectors.toList());
    }

    // Accepter une livraison
    public LivraisonResponseDTO accepterLivraison(Long livreurId, Long livraisonId) {
        Livreur livreur = livreurRepository.findById(livreurId)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));

        Livraison livraison = livraisonRepository.findById(livraisonId)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));

        if (!"EN_ATTENTE".equals(livraison.getStatut())) {
            throw new RuntimeException("Livraison déjà acceptée");
        }

        List<Livraison> enCours = livraisonRepository.findByLivreurIdAndStatut(livreurId, "EN_COURS");
        if (!enCours.isEmpty()) {
            throw new RuntimeException("Vous avez déjà une livraison en cours");
        }

        livraison.setLivreur(livreur);
        livraison.accepter();
        livraison = livraisonRepository.save(livraison);

        return mapToLivraisonResponseDTO(livraison);
    }

    // Démarrer une livraison
    public LivraisonResponseDTO demarrerLivraison(Long livreurId, Long livraisonId) {
        Livraison livraison = livraisonRepository.findById(livraisonId)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));

        if (!livraison.getLivreur().getId().equals(livreurId)) {
            throw new RuntimeException("Cette livraison ne vous est pas attribuée");
        }

        if (!"ACCEPTEE".equals(livraison.getStatut())) {
            throw new RuntimeException("La livraison doit être acceptée avant d'être démarrée");
        }

        livraison.demarrer();
        livraison = livraisonRepository.save(livraison);

        return mapToLivraisonResponseDTO(livraison);
    }

    // Terminer une livraison
    public LivraisonResponseDTO terminerLivraison(Long livreurId, Long livraisonId) {
        Livraison livraison = livraisonRepository.findById(livraisonId)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));

        if (!livraison.getLivreur().getId().equals(livreurId)) {
            throw new RuntimeException("Cette livraison ne vous est pas attribuée");
        }

        if (!"EN_COURS".equals(livraison.getStatut())) {
            throw new RuntimeException("La livraison doit être en cours pour être terminée");
        }

        livraison.terminer();
        livraison = livraisonRepository.save(livraison);

        Livreur livreur = livraison.getLivreur();
        livreur.setTotalGains(livreur.getTotalGains().add(livraison.getMontantGain()));
        livreurRepository.save(livreur);

        return mapToLivraisonResponseDTO(livraison);
    }

    // Statistiques
    public StatistiquesDTO getStatistiques(Long id) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));

        List<Livraison> livraisons = livraisonRepository.findByLivreurId(id);
        long nombreLivraisonsTerminees = livraisons.stream()
                .filter(l -> "TERMINEE".equals(l.getStatut()))
                .count();

        BigDecimal distanceTotale = livraisons.stream()
                .filter(l -> l.getDistanceKm() != null)
                .map(Livraison::getDistanceKm)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        StatistiquesDTO stats = new StatistiquesDTO();
        stats.setNombreLivraisons((long) livraisons.size());
        stats.setNombreLivraisonsTerminees(nombreLivraisonsTerminees);
        stats.setTotalGains(livreur.getTotalGains());
        stats.setDistanceTotale(distanceTotale);

        return stats;
    }

    // Gains
    public GainsDTO getGains(Long id) {
        Livreur livreur = livreurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livreur non trouvé"));

        List<Livraison> livraisons = livraisonRepository.findByLivreurId(id);

        LocalDateTime debutMois = LocalDateTime.now()
                .withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        BigDecimal gainsMoisActuel = livraisons.stream()
                .filter(l -> "TERMINEE".equals(l.getStatut()))
                .filter(l -> l.getDateLivraison() != null && l.getDateLivraison().isAfter(debutMois))
                .map(Livraison::getMontantGain)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long nombreLivraisonsMois = livraisons.stream()
                .filter(l -> "TERMINEE".equals(l.getStatut()))
                .filter(l -> l.getDateLivraison() != null && l.getDateLivraison().isAfter(debutMois))
                .count();

        GainsDTO gains = new GainsDTO();
        gains.setTotalGains(livreur.getTotalGains());
        gains.setGainsMoisActuel(gainsMoisActuel);
        gains.setNombreLivraisonsMois(nombreLivraisonsMois);

        return gains;
    }

    // Mapper Livreur → LivreurResponseDTO
    private LivreurResponseDTO mapToResponseDTO(Livreur livreur) {
        LivreurResponseDTO dto = new LivreurResponseDTO();
        dto.setId(livreur.getId());
        dto.setNom(livreur.getNom());
        dto.setPrenom(livreur.getPrenom());
        dto.setEmail(livreur.getEmail());
        dto.setTelephone(livreur.getTelephone());
        dto.setZoneActivite(livreur.getZoneActivite());
        dto.setIsDisponible(livreur.getIsDisponible());
        dto.setTotalGains(livreur.getTotalGains());
        return dto;
    }

    // Mapper Livraison → LivraisonResponseDTO
    private LivraisonResponseDTO mapToLivraisonResponseDTO(Livraison livraison) {
        LivraisonResponseDTO dto = new LivraisonResponseDTO();
        dto.setId(livraison.getId());
        dto.setCommandeId(livraison.getCommandeId());
        dto.setStatut(livraison.getStatut());
        dto.setDistanceKm(livraison.getDistanceKm());
        dto.setMontantGain(livraison.getMontantGain());
        dto.setLivreurId(livraison.getLivreur() != null ? livraison.getLivreur().getId() : null);
        dto.setDateCreation(livraison.getDateCreation());
        dto.setDateAcceptation(livraison.getDateAcceptation());
        dto.setDateDemarrage(livraison.getDateDemarrage());
        dto.setDateLivraison(livraison.getDateLivraison());
        return dto;
    }
}
