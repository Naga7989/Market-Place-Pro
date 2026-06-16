package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/** Platform-wide configurable settings. Editable by Super Admin at runtime. */
@Entity
@Table(name = "settings")
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "key_name", nullable = false, unique = true, length = 200)
    private String keyName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;

    @Column(length = 500)
    private String description;

    /** STRING, NUMBER, BOOLEAN, JSON */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String dataType = "STRING";

    /** Group for categorisation: PAYMENT, EMAIL, COMMISSION, FEATURE_FLAG */
    @Column(length = 100)
    private String settingGroup;

    /** Whether value is encrypted at rest */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isEncrypted = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
