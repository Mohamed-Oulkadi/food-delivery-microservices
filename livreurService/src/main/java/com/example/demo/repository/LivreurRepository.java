package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Livreur;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivreurRepository extends JpaRepository<Livreur, Long> {
    
    Optional<Livreur> findByEmail(String email);
    
    List<Livreur> findByIsDisponibleTrue();
    
    List<Livreur> findByIsDisponibleTrueAndZoneActivite(String zoneActivite);
}