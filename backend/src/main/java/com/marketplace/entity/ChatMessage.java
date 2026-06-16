package com.marketplace.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/** A single message within a chat room. */
@Entity
@Table(name = "chat_messages", indexes = {
        @Index(name = "idx_chat_messages_room_id", columnList = "room_id"),
        @Index(name = "idx_chat_messages_sender_id", columnList = "sender_id"),
        @Index(name = "idx_chat_messages_created_at", columnList = "created_at")
})
@JsonIgnoreProperties("hibernateLazyInitializer")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @JsonIgnore
    private ChatRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /** TEXT, IMAGE, FILE, SYSTEM */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String messageType = "TEXT";

    @Column(length = 500)
    private String mediaUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
