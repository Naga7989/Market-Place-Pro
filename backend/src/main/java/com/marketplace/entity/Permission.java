package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Fine-grained permission entity.
 * e.g., resource="PRODUCT", action="CREATE" → permission to create products.
 */
@Entity
@Table(name = "permissions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"resource", "action"})
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable permission name, e.g., "product:create" */
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    /** The resource this permission applies to, e.g., "PRODUCT", "ORDER" */
    @Column(nullable = false, length = 50)
    private String resource;

    /** The action allowed, e.g., "CREATE", "READ", "UPDATE", "DELETE" */
    @Column(nullable = false, length = 50)
    private String action;

    @Column(length = 255)
    private String description;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
