package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** A client project posted on the freelancer marketplace. */
@Entity
@Table(name = "projects", indexes = {
        @Index(name = "idx_projects_client_id", columnList = "client_id"),
        @Index(name = "idx_projects_status", columnList = "status"),
        @Index(name = "idx_projects_hired_freelancer_id", columnList = "hired_freelancer_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @JsonIgnore
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hired_freelancer_id")
    private Freelancer hiredFreelancer;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    /** Required skills (comma-separated or JSON) */
    @Column(columnDefinition = "TEXT")
    private String skillsRequired;

    /** Budget range min in INR */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal budgetMin;

    /** Budget range max in INR */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal budgetMax;

    /** Agreed project price (set when proposal accepted) */
    @Column(precision = 12, scale = 2)
    private BigDecimal agreedPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.OPEN;

    /** HOURLY or FIXED */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String pricingType = "FIXED";

    private LocalDate deadline;

    /** DAYS count for completion */
    @Column
    private Integer durationDays;

    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Proposal> proposals = new ArrayList<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Milestone> milestones = new ArrayList<>();
}
