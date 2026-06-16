package com.marketplace.controller;

import com.marketplace.dto.response.ApiResponse;
import com.marketplace.dto.response.PageResponse;
import com.marketplace.entity.Freelancer;
import com.marketplace.entity.Project;
import com.marketplace.entity.Proposal;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.FreelancerRepository;
import com.marketplace.repository.ProjectRepository;
import com.marketplace.repository.ProposalRepository;
import com.marketplace.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Freelancers", description = "Freelancer marketplace APIs")
@RestController
@RequiredArgsConstructor
public class FreelancerController {

    private final FreelancerRepository freelancerRepository;
    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;

    // ──────────────────── Freelancers ────────────────────

    @Operation(summary = "Get top freelancers")
    @GetMapping("/freelancers")
    public ResponseEntity<ApiResponse<PageResponse<Freelancer>>> getFreelancers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Freelancer> freelancers = freelancerRepository.findTopRated(pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(freelancers)));
    }

    @Operation(summary = "Get freelancer by ID")
    @GetMapping("/freelancers/{id}")
    public ResponseEntity<ApiResponse<Freelancer>> getFreelancer(@PathVariable Long id) {
        Freelancer freelancer = freelancerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer", id));
        return ResponseEntity.ok(ApiResponse.success(freelancer));
    }

    @Operation(summary = "Get my freelancer profile")
    @GetMapping("/freelancers/me")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<ApiResponse<Freelancer>> getMyProfile(@AuthenticationPrincipal CustomUserDetails currentUser) {
        Freelancer freelancer = freelancerRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found"));
        return ResponseEntity.ok(ApiResponse.success(freelancer));
    }

    // ──────────────────── Projects ────────────────────

    @Operation(summary = "Get open projects")
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<PageResponse<Project>>> getProjects(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Project> projects = q != null
                ? projectRepository.searchOpenProjects(q, pageable)
                : projectRepository.findByStatus(com.marketplace.enums.ProjectStatus.OPEN, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(projects)));
    }

    @Operation(summary = "Get project by ID")
    @GetMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Project>> getProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        return ResponseEntity.ok(ApiResponse.success(project));
    }

    @Operation(summary = "Post a new project (Client)")
    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<Project>> postProject(
            @RequestBody Project projectData,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        // Set client details from auth context
        projectData.setStatus(com.marketplace.enums.ProjectStatus.OPEN);
        Project saved = projectRepository.save(projectData);
        return ResponseEntity.status(201).body(ApiResponse.success("Project posted successfully", saved));
    }

    @Operation(summary = "Get proposals for a project")
    @GetMapping("/projects/{id}/proposals")
    public ResponseEntity<ApiResponse<List<Proposal>>> getProposals(@PathVariable Long id) {
        List<Proposal> proposals = proposalRepository.findByProjectIdOrderByCreatedAtDesc(id);
        return ResponseEntity.ok(ApiResponse.success(proposals));
    }

    @Operation(summary = "Submit a proposal for a project (Freelancer)")
    @PostMapping("/projects/{id}/proposals")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<ApiResponse<Proposal>> submitProposal(
            @PathVariable Long id,
            @RequestBody Proposal proposalData) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        proposalData.setProject(project);
        proposalData.setStatus(com.marketplace.enums.ProposalStatus.PENDING);
        Proposal saved = proposalRepository.save(proposalData);
        return ResponseEntity.status(201).body(ApiResponse.success("Proposal submitted successfully", saved));
    }
}
