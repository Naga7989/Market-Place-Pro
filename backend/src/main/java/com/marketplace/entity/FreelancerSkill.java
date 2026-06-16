package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/** A skill tagged to a freelancer profile. */
@Entity
@Table(name = "freelancer_skills", indexes = {
        @Index(name = "idx_freelancer_skills_freelancer_id", columnList = "freelancer_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class FreelancerSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    @JsonIgnore
    private Freelancer freelancer;

    @Column(nullable = false, length = 100)
    private String skillName;

    /** BEGINNER, INTERMEDIATE, EXPERT */
    @Column(length = 30)
    @Builder.Default
    private String proficiencyLevel = "INTERMEDIATE";

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
