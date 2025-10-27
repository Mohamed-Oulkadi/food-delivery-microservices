package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Livraison;

import java.util.List;

@Repository
public interface LivraisonRepository extends JpaRepository<Livraison, Long> {
    
    List<Livraison> findByLivreurId(Long livreurId);
    
    List<Livraison> findByLivreurIdAndStatut(Long livreurId, String statut);
    
    List<Livraison> findByStatut(String statut);
}