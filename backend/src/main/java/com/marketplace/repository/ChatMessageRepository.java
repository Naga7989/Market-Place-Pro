package com.marketplace.repository;

import com.marketplace.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByRoomIdOrderByCreatedAtAsc(Long roomId, Pageable pageable);

    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.isRead = true WHERE cm.room.id = :roomId AND cm.sender.id != :userId AND cm.isRead = false")
    int markRoomMessagesAsRead(@Param("roomId") Long roomId, @Param("userId") Long userId);

    long countByRoomIdAndIsReadFalseAndSenderIdNot(Long roomId, Long senderId);
}
