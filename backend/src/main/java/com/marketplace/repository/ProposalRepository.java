package com.marketplace.repository;

import com.marketplace.entity.Proposal;
import com.marketplace.enums.ProposalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    Optional<Proposal> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
    Page<Proposal> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId, Pageable pageable);
    Page<Proposal> findByProjectIdAndStatus(Long projectId, ProposalStatus status, Pageable pageable);
    boolean existsByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
}
