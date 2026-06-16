package com.marketplace.repository;

import com.marketplace.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    // ✅ ChatRoom uses Set<User> participants, not participant1Id/participant2Id
    @Query("SELECT cr FROM ChatRoom cr JOIN cr.participants p WHERE p.id = :userId ORDER BY cr.updatedAt DESC")
    List<ChatRoom> findByParticipant(@Param("userId") Long userId);

    // ✅ Find room by both participants and type
    @Query("SELECT cr FROM ChatRoom cr JOIN cr.participants p1 JOIN cr.participants p2 WHERE p1.id = :u1 AND p2.id = :u2 AND cr.roomType = :type AND cr.referenceId = :refId")
    Optional<ChatRoom> findExistingRoom(@Param("u1") Long u1, @Param("u2") Long u2,
                                         @Param("type") String type, @Param("refId") Long refId);
}
