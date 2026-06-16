package com.marketplace.config;

import com.marketplace.entity.*;
import com.marketplace.enums.UserRole;
import com.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
@Slf4j
public class ServiceSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final MarketplaceServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking if service data needs to be seeded...");


        // 1. Get or create Service Provider Role
        Role providerRole = roleRepository.findByName("SERVICE_PROVIDER")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name("SERVICE_PROVIDER")
                        .description("Offers professional services")
                        .build()));

        // 2. Get or create Service Provider User
        String email = "provider@marketplace.in";
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .fullName("Aura Wellness & Repair Services")
                            .phone("+919000000004")
                            .password(passwordEncoder.encode("Admin@123!"))
                            .primaryRole(UserRole.SERVICE_PROVIDER)
                            .roles(new HashSet<>(Collections.singletonList(providerRole)))
                            .isEmailVerified(true)
                            .isPhoneVerified(true)
                            .isActive(true)
                            .build();
                    return userRepository.save(newUser);
                });

        // 3. Create Service Provider Profile
        ServiceProvider provider = serviceProviderRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    ServiceProvider newProvider = ServiceProvider.builder()
                            .user(user)
                            .businessName("Aura Wellness & Repair Services")
                            .bio("Verified and highly-rated local home repair & wellness spa services.")
                            .experienceYears(6)
                            .rating(BigDecimal.valueOf(4.8))
                            .totalReviews(240)
                            .totalBookings(480)
                            .isVerified(true)
                            .isActive(true)
                            .build();
                    return serviceProviderRepository.save(newProvider);
                });

        // 4. Find or Create Service Categories matching the database seed slugs
        ServiceCategory acCat = serviceCategoryRepository.findBySlug("home-ac-service")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("AC Service & Repair").slug("home-ac-service").isActive(true).build()));

        ServiceCategory cleaningCat = serviceCategoryRepository.findBySlug("home-deep-cleaning")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Deep Cleaning").slug("home-deep-cleaning").isActive(true).build()));

        ServiceCategory spaCat = serviceCategoryRepository.findBySlug("beauty-massage")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Massage & Relaxation").slug("beauty-massage").isActive(true).build()));

        ServiceCategory plumbingCat = serviceCategoryRepository.findBySlug("home-plumbing")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Plumbing").slug("home-plumbing").isActive(true).build()));

        ServiceCategory electricianCat = serviceCategoryRepository.findBySlug("home-electrician")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Electrician").slug("home-electrician").isActive(true).build()));

        ServiceCategory carpentryCat = serviceCategoryRepository.findBySlug("home-carpentry")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Carpentry").slug("home-carpentry").isActive(true).build()));

        ServiceCategory pestCat = serviceCategoryRepository.findBySlug("home-pest-control")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Pest Control").slug("home-pest-control").isActive(true).build()));

        ServiceCategory womenSalonCat = serviceCategoryRepository.findBySlug("beauty-womens-salon")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Women Salon at Home").slug("beauty-womens-salon").isActive(true).build()));

        ServiceCategory menGroomingCat = serviceCategoryRepository.findBySlug("beauty-mens-salon")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Men Grooming").slug("beauty-mens-salon").isActive(true).build()));

        ServiceCategory tuitionCat = serviceCategoryRepository.findBySlug("edu-home-tuition")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Home Tuition").slug("edu-home-tuition").isActive(true).build()));

        ServiceCategory languageCat = serviceCategoryRepository.findBySlug("edu-language")
                .orElseGet(() -> serviceCategoryRepository.save(ServiceCategory.builder()
                        .name("Language Classes").slug("edu-language").isActive(true).build()));

        // 5. Seed Services matching the IDs expected by the frontend
        // 201: AC Service & Gas Recharge
        if (!serviceRepository.existsById(201L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(201L)
                    .provider(provider)
                    .category(acCat)
                    .name("AC Service & Gas Recharge")
                    .description("Complete filter cleaning, cooling coil check, gas replenishment, and performance diagnostics. Our technician will clean the AC unit and top up refrigerant gas if cooling is low. Recommended every 6 months for optimal cooling performance.")
                    .basePrice(BigDecimal.valueOf(1499.00))
                    .durationMinutes(60)
                    .rating(BigDecimal.valueOf(4.8))
                    .totalReviews(240)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 202: Full Home Deep Cleaning
        if (!serviceRepository.existsById(202L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(202L)
                    .provider(provider)
                    .category(cleaningCat)
                    .name("Full Home Deep Cleaning")
                    .description("Intense dusting, vacuuming, mopping, kitchen degreasing, bathroom scrubbing, and disinfection. Includes cleaning of windows, kitchen cabinets, bathroom floor tiles, and balcony mopping. Eco-friendly cleaning chemicals used.")
                    .basePrice(BigDecimal.valueOf(4999.00))
                    .durationMinutes(240)
                    .rating(BigDecimal.valueOf(4.9))
                    .totalReviews(480)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 203: Stress Relief Deep Tissue Massage
        if (!serviceRepository.existsById(203L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(203L)
                    .provider(provider)
                    .category(spaCat)
                    .name("Stress Relief Deep Tissue Massage")
                    .description("60 minutes of professional body massage with herbal oils to relieve fatigue and muscle knots. Therapist will carry massage table, sheets, and essential oils. Recommended for deep body relaxation.")
                    .basePrice(BigDecimal.valueOf(1999.00))
                    .durationMinutes(60)
                    .rating(BigDecimal.valueOf(4.7))
                    .totalReviews(155)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 204: Professional Plumber Leak Repair & Fitting
        if (!serviceRepository.existsById(204L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(204L)
                    .provider(provider)
                    .category(plumbingCat)
                    .name("Professional Plumber Leak Repair & Fitting")
                    .description("Fixing leaking taps, pipe blockages, sink installation, and general bathroom fitting repair services. Standard inspection fee included.")
                    .basePrice(BigDecimal.valueOf(499.00))
                    .durationMinutes(45)
                    .rating(BigDecimal.valueOf(4.6))
                    .totalReviews(98)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 205: Expert Electrician Wiring & Installation
        if (!serviceRepository.existsById(205L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(205L)
                    .provider(provider)
                    .category(electricianCat)
                    .name("Expert Electrician Wiring & Installation")
                    .description("Installation of switches, fans, lights, geyser repairs, and complete diagnostic checks for short-circuits. Safety-first protocols followed.")
                    .basePrice(BigDecimal.valueOf(599.00))
                    .durationMinutes(60)
                    .rating(BigDecimal.valueOf(4.8))
                    .totalReviews(112)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 206: Furniture Assembly & Woodwork Repair
        if (!serviceRepository.existsById(206L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(206L)
                    .provider(provider)
                    .category(carpentryCat)
                    .name("Furniture Assembly & Woodwork Repair")
                    .description("Expert door hinge alignment, lock installations, table drawer repairs, and quick assembly of modular wardrobes or tables.")
                    .basePrice(BigDecimal.valueOf(899.00))
                    .durationMinutes(90)
                    .rating(BigDecimal.valueOf(4.7))
                    .totalReviews(85)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 207: Complete Home Pest & Termite Control
        if (!serviceRepository.existsById(207L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(207L)
                    .provider(provider)
                    .category(pestCat)
                    .name("Complete Home Pest & Termite Control")
                    .description("Professional spray and gel treatment targeting cockroaches, ants, termites, and bedbugs. Odourless, eco-friendly, and completely safe for kids and pets.")
                    .basePrice(BigDecimal.valueOf(1999.00))
                    .durationMinutes(120)
                    .rating(BigDecimal.valueOf(4.9))
                    .totalReviews(210)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 208: Salon Facial & Hair Spa Treatment
        if (!serviceRepository.existsById(208L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(208L)
                    .provider(provider)
                    .category(womenSalonCat)
                    .name("Salon Facial & Hair Spa Treatment")
                    .description("Facial cleansing, herbal skin scrub, deep hair nourishment spa, and mini manicure at the comfort of your home. Professional stylists only.")
                    .basePrice(BigDecimal.valueOf(1299.00))
                    .durationMinutes(90)
                    .rating(BigDecimal.valueOf(4.7))
                    .totalReviews(144)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 209: Men Classic Haircut & Beard Grooming
        if (!serviceRepository.existsById(209L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(209L)
                    .provider(provider)
                    .category(menGroomingCat)
                    .name("Men Classic Haircut & Beard Grooming")
                    .description("Professional hair cutting, head massage, neck trimming, and precise beard line styling/trimming at home. Hygienic single-use kits.")
                    .basePrice(BigDecimal.valueOf(399.00))
                    .durationMinutes(45)
                    .rating(BigDecimal.valueOf(4.5))
                    .totalReviews(76)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 210: 1-on-1 Home Tuition (Maths & Science)
        if (!serviceRepository.existsById(210L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(210L)
                    .provider(provider)
                    .category(tuitionCat)
                    .name("1-on-1 Home Tuition (Maths & Science)")
                    .description("Personalised home tutor sessions for grades 6-10 to improve academic marks and solve difficult concepts. Choose 2 demo classes.")
                    .basePrice(BigDecimal.valueOf(499.00))
                    .durationMinutes(60)
                    .rating(BigDecimal.valueOf(4.8))
                    .totalReviews(54)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        // 211: Conversational English & French Classes
        if (!serviceRepository.existsById(211L)) {
            MarketplaceService svc = MarketplaceService.builder()
                    .id(211L)
                    .provider(provider)
                    .category(languageCat)
                    .name("Conversational English & French Classes")
                    .description("Learn fluent pronunciation, regular vocabulary, and daily speech structure from native-level language trainers. Custom batch slots.")
                    .basePrice(BigDecimal.valueOf(999.00))
                    .durationMinutes(60)
                    .rating(BigDecimal.valueOf(4.6))
                    .totalReviews(67)
                    .serviceMode("HOME_VISIT")
                    .isActive(true)
                    .build();
            serviceRepository.save(svc);
        }

        log.info("Service seeding successfully completed.");
    }
}
