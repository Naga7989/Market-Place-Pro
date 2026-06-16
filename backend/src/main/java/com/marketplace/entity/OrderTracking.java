package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.marketplace.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/** Order status tracking history. Each status change is logged. */
@Entity
@Table(name = "order_tracking", indexes = {
        @Index(name = "idx_order_tracking_order_id", columnList = "order_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status;

    @Column(length = 200)
    private String location;

    @Column(length = 500)
    private String description;

    /** Timestamp of this tracking event */
    @Column(nullable = false)
    private LocalDateTime eventTimestamp;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
