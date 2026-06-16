package com.marketplace.service;

import com.marketplace.entity.Notification;
import com.marketplace.entity.User;
import com.marketplace.enums.NotificationType;
import com.marketplace.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Async
    @Transactional
    public void sendNotification(User user, NotificationType type, String title, String message) {
        try {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setType(type);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setIsRead(false);
            notificationRepository.save(notification);
            log.debug("Notification sent to user {}: {}", user.getId(), title);
        } catch (Exception e) {
            log.error("Failed to send notification to user {}: {}", user.getId(), e.getMessage());
        }
    }

    @Async
    public void sendWelcomeNotification(User user) {
        sendNotification(user, NotificationType.SYSTEM,
                "Welcome to MarketPlace Pro! 🎉",
                "Thank you for joining! Explore thousands of products, services, and freelancers.");
    }

    @Async
    public void sendOrderNotification(User user, String orderNumber, String status) {
        sendNotification(user, NotificationType.ORDER,
                "Order Update: " + orderNumber,
                "Your order #" + orderNumber + " is now " + status.toLowerCase().replace("_", " "));
    }

    @Async
    public void sendBookingNotification(User user, Long bookingId, String status) {
        sendNotification(user, NotificationType.BOOKING,
                "Booking #" + bookingId + " Updated",
                "Your booking status has been updated to: " + status);
    }

    @Async
    public void sendPaymentNotification(User user, String amount, String status) {
        sendNotification(user, NotificationType.PAYMENT,
                "Payment " + status,
                "Payment of ₹" + amount + " has been " + status.toLowerCase());
    }

    @Transactional(readOnly = true)
    public Page<Notification> getNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public boolean markAsRead(Long notificationId, Long userId) {
        return notificationRepository.markAsRead(notificationId, userId) > 0;
    }

    @Transactional
    public int markAllAsRead(Long userId) {
        return notificationRepository.markAllAsRead(userId);
    }
}
