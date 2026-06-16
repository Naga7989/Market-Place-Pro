package com.marketplace.repository;

import com.marketplace.entity.Freelancer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FreelancerRepository extends JpaRepository<Freelancer, Long> {
    Optional<Freelancer> findByUserId(Long userId);
    boolean existsByUserId(Long userId);

    // ✅ Freelancer has 'isAvailable' not 'status'; 'completedProjects' not 'totalProjects'
    @Query("SELECT f FROM Freelancer f WHERE f.isAvailable = true AND f.hourlyRate BETWEEN :minRate AND :maxRate ORDER BY f.rating DESC")
    Page<Freelancer> findByRateRange(@Param("minRate") BigDecimal minRate, @Param("maxRate") BigDecimal maxRate, Pageable pageable);

    @Query("SELECT f FROM Freelancer f JOIN f.skills s WHERE s.skillName IN :skills AND f.isAvailable = true")
    Page<Freelancer> findBySkills(@Param("skills") List<String> skills, Pageable pageable);

    @Query("SELECT f FROM Freelancer f WHERE f.isAvailable = true ORDER BY f.rating DESC, f.completedProjects DESC")
    Page<Freelancer> findTopRated(Pageable pageable);

    @Query("SELECT COUNT(f) FROM Freelancer f WHERE f.isAvailable = true")
    Long countActive();
}
