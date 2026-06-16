package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalTime;
import java.time.LocalDateTime;

/** Weekly availability schedule for a service provider. */
@Entity
@Table(name = "service_availability", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"provider_id", "day_of_week"})
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ServiceAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    @JsonIgnore
    private ServiceProvider provider;

    /** 0=Monday ... 6=Sunday */
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
