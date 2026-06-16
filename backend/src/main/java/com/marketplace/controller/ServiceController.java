package com.marketplace.controller;

import com.marketplace.dto.response.ApiResponse;
import com.marketplace.dto.response.PageResponse;
import com.marketplace.entity.Booking;
import com.marketplace.entity.MarketplaceService;
import com.marketplace.entity.ServiceCategory;
import com.marketplace.entity.ServiceProvider;
import com.marketplace.enums.BookingStatus;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.BookingRepository;
import com.marketplace.repository.ServiceCategoryRepository;
import com.marketplace.repository.ServiceProviderRepository;
import com.marketplace.repository.MarketplaceServiceRepository;
import com.marketplace.entity.User;
import com.marketplace.entity.Address;
import com.marketplace.entity.TimeSlot;
import com.marketplace.enums.PaymentMethod;
import com.marketplace.enums.PaymentStatus;
import com.marketplace.repository.UserRepository;
import com.marketplace.repository.AddressRepository;
import com.marketplace.repository.TimeSlotRepository;
import org.springframework.transaction.annotation.Transactional;
import com.marketplace.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Services", description = "Home services and booking APIs")
@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceController {

    private final MarketplaceServiceRepository serviceRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Operation(summary = "Get all service categories")
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<ServiceCategory>>> getServiceCategories() {
        List<ServiceCategory> categories = serviceCategoryRepository.findByIsActiveTrueOrderByNameAsc();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @Operation(summary = "Get public services (no auth required)")
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<PageResponse<MarketplaceService>>> getPublicServices(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        
        Page<MarketplaceService> services;
        if (categoryId != null) {
            java.util.List<Long> categoryIds = new java.util.ArrayList<>();
            categoryIds.add(categoryId);
            
            serviceCategoryRepository.findById(categoryId).ifPresent(cat -> {
                if (cat.getChildren() != null) {
                    for (ServiceCategory child : cat.getChildren()) {
                        categoryIds.add(child.getId());
                    }
                }
            });
            
            services = serviceRepository.findByCategoryIdInAndIsActiveTrue(categoryIds, pageable);
        } else {
            services = serviceRepository.findByIsActiveTrueOrderByRatingDesc(pageable);
        }
        
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(services)));
    }

    @Operation(summary = "Get service details")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MarketplaceService>> getService(@PathVariable Long id) {
        MarketplaceService service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        return ResponseEntity.ok(ApiResponse.success(service));
    }

    @Operation(summary = "Book a service")
    @PostMapping("/book")
    @Transactional
    public ResponseEntity<ApiResponse<Booking>> bookService(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Long serviceId = Long.parseLong(body.get("serviceId").toString());
        Long addressId = Long.parseLong(body.get("addressId").toString());
        String scheduledAtStr = body.get("scheduledAt").toString();
        String notes = body.containsKey("notes") ? (String) body.get("notes") : "";

        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", currentUser.getUserId()));

        MarketplaceService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service", serviceId));

        Address address = addressRepository.findByIdAndUserId(addressId, currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", addressId));

        java.time.LocalDateTime scheduledAt = java.time.LocalDateTime.parse(scheduledAtStr);
        java.time.LocalDate slotDate = scheduledAt.toLocalDate();
        java.time.LocalTime startTime = scheduledAt.toLocalTime();
        int duration = service.getDurationMinutes() != null ? service.getDurationMinutes() : 60;
        java.time.LocalTime endTime = startTime.plusMinutes(duration);

        // Find or create TimeSlot
        TimeSlot slot = timeSlotRepository.findByProviderIdAndServiceIdAndSlotDateAndStartTime(
                service.getProvider().getId(), serviceId, slotDate, startTime)
                .orElseGet(() -> {
                    TimeSlot newSlot = new TimeSlot();
                    newSlot.setProvider(service.getProvider());
                    newSlot.setService(service);
                    newSlot.setSlotDate(slotDate);
                    newSlot.setStartTime(startTime);
                    newSlot.setEndTime(endTime);
                    newSlot.setIsAvailable(false);
                    newSlot.setIsBooked(true);
                    return timeSlotRepository.save(newSlot);
                });

        slot.setIsBooked(true);
        slot.setIsAvailable(false);
        timeSlotRepository.save(slot);

        java.math.BigDecimal basePrice = service.getBasePrice();
        java.math.BigDecimal tax = basePrice.multiply(java.math.BigDecimal.valueOf(0.18));
        java.math.BigDecimal totalAmount = basePrice.add(tax);

        Booking booking = new Booking();
        booking.setBookingNumber("BKN-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 900 + 100));
        booking.setUser(user);
        booking.setProvider(service.getProvider());
        booking.setService(service);
        booking.setSlot(slot);
        booking.setAddress(address);
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentMethod(PaymentMethod.COD);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setTotalAmount(totalAmount);
        booking.setCommissionAmount(basePrice.multiply(java.math.BigDecimal.valueOf(0.10)));
        booking.setCustomerNotes(notes);
        booking.setIsReviewed(false);

        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.status(201).body(ApiResponse.success("Booking created successfully", saved));
    }

    @Operation(summary = "Get my bookings")
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<PageResponse<Booking>>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Page<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(
                currentUser.getUserId(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(bookings)));
    }

    @Operation(summary = "Get provider's bookings")
    @GetMapping("/provider/bookings")
    @PreAuthorize("hasRole('SERVICE_PROVIDER')")
    public ResponseEntity<ApiResponse<PageResponse<Booking>>> getProviderBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        ServiceProvider provider = serviceProviderRepository.findByUserId(currentUser.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Service provider profile not found"));

        Page<Booking> bookings = bookingRepository.findByProviderIdOrderByCreatedAtDesc(
                provider.getId(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(bookings)));
    }

    @Operation(summary = "Update booking status (Provider)")
    @PutMapping("/bookings/{id}/status")
    @PreAuthorize("hasAnyRole('SERVICE_PROVIDER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));

        BookingStatus status = BookingStatus.valueOf(body.get("status"));
        booking.setStatus(status);
        bookingRepository.save(booking);

        return ResponseEntity.ok(ApiResponse.success("Booking status updated", null));
    }
}
