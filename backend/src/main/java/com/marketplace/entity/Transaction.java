package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Wallet transaction history (credit/debit entries). */
@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_transactions_wallet_id", columnList = "wallet_id"),
        @Index(name = "idx_transactions_user_id", columnList = "user_id")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id", nullable = false)
    @JsonIgnore
    private Wallet wallet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    /** CREDIT or DEBIT */
    @Column(nullable = false, length = 10)
    private String type;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal balanceBefore;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal balanceAfter;

    @Column(nullable = false, length = 500)
    private String description;

    /** Reference ID: orderId, bookingId, etc. */
    @Column(length = 100)
    private String referenceId;

    /** ORDER, BOOKING, CASHBACK, REFUND, TOPUP, WITHDRAWAL */
    @Column(nullable = false, length = 30)
    private String transactionType;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
