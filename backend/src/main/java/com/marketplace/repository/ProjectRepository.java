package com.marketplace.repository;

import com.marketplace.entity.Project;
import com.marketplace.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByClientIdOrderByCreatedAtDesc(Long clientId, Pageable pageable);
    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);
    Optional<Project> findByIdAndClientId(Long id, Long clientId);

    @Query("SELECT p FROM Project p WHERE p.status = 'OPEN' AND LOWER(p.title) LIKE LOWER(CONCAT('%',:query,'%'))")
    Page<Project> searchOpenProjects(@Param("query") String query, Pageable pageable);
}
