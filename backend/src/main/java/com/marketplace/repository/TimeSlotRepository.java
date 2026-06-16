package com.marketplace.repository;

import com.marketplace.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    Optional<TimeSlot> findByProviderIdAndServiceIdAndSlotDateAndStartTime(
            Long providerId, Long serviceId, LocalDate slotDate, LocalTime startTime);
}
