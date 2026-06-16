package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** Freelancer profile for project-based marketplace. */
@Entity
@Table(name = "freelancers", indexes = {
        @Index(name = "idx_freelancers_user_id", columnList = "user_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(nullable = false, length = 200)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 500)
    private String profileImageUrl;

    /** Hourly rate in INR */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalReviews = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer completedProjects = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer experienceYears = 0;

    /** Portfolio website URL */
    @Column(length = 500)
    private String portfolioUrl;

    /** JSON array of portfolio image URLs */
    @Column(columnDefinition = "TEXT")
    private String portfolioImagesJson;

    /** LinkedIn profile URL */
    @Column(length = 500)
    private String linkedinUrl;

    /** GitHub profile URL */
    @Column(length = 500)
    private String githubUrl;

    @Column(length = 100)
    private String location;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<FreelancerSkill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "freelancer", fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Proposal> proposals = new ArrayList<>();
}
