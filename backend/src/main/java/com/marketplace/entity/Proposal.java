package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.ProposalStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** A freelancer's bid/proposal for a client project. */
@Entity
@Table(name = "proposals", indexes = {
        @Index(name = "idx_proposals_project_id", columnList = "project_id"),
        @Index(name = "idx_proposals_freelancer_id", columnList = "freelancer_id")
}, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"project_id", "freelancer_id"})
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private Freelancer freelancer;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal bidAmount;

    /** Estimated completion days */
    @Column(nullable = false)
    private Integer deliveryDays;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ProposalStatus status = ProposalStatus.PENDING;

    @Column(length = 1000)
    private String clientNotes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
