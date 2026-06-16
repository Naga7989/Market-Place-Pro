package com.marketplace.controller;

import com.marketplace.dto.response.ApiResponse;
import com.marketplace.entity.Notification;
import com.marketplace.dto.response.PageResponse;
import com.marketplace.security.CustomUserDetails;
import com.marketplace.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Notifications", description = "User notification management APIs")
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @Operation(summary = "Get my notifications")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Notification>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Page<Notification> notifications = notificationService.getNotifications(
                currentUser.getUserId(), PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(notifications)));
    }

    @Operation(summary = "Get unread notification count")
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        long count = notificationService.getUnreadCount(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", count)));
    }

    @Operation(summary = "Mark notification as read")
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        notificationService.markAsRead(id, currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @Operation(summary = "Mark all notifications as read")
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> markAllAsRead(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        int count = notificationService.markAllAsRead(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success(Map.of("markedAsRead", count)));
    }
}
