package com.marketplace.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketplace.dto.response.ApiResponse;
import com.marketplace.security.JwtAuthenticationFilter;
import com.marketplace.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;
    private final ObjectMapper objectMapper;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    private static final String[] PUBLIC_URLS = {
            "/auth/**",
            "/products/**",
            "/categories/**",
            "/services/public/**",
            "/services/categories",
            "/search/**",
            "/freelancers",
            "/freelancers/{id}",
            "/projects",
            "/projects/{id}",
            "/coupons",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/actuator/health",
            "/actuator/info",
            "/ws/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_URLS).permitAll()
                .requestMatchers(HttpMethod.GET, "/vendors/{id}", "/vendors/{id}/products").permitAll()
                .requestMatchers(HttpMethod.GET, "/stores/**").permitAll()
                .requestMatchers("/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                .requestMatchers("/super-admin/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/vendors/me/**", "/products/create", "/products/{id}/update").hasAnyRole("SELLER", "ADMIN")
                .requestMatchers("/providers/**").hasAnyRole("SERVICE_PROVIDER", "ADMIN")
                .requestMatchers("/delivery/**").hasAnyRole("DELIVERY_PARTNER", "ADMIN")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType("application/json");
                    ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                            .success(false)
                            .message("Unauthorized - Please login to continue")
                            .statusCode(401)
                            .path(request.getRequestURI())
                            .build();
                    objectMapper.writeValue(response.getWriter(), apiResponse);
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(403);
                    response.setContentType("application/json");
                    ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                            .success(false)
                            .message("Forbidden - You don't have permission to access this resource")
                            .statusCode(403)
                            .path(request.getRequestURI())
                            .build();
                    objectMapper.writeValue(response.getWriter(), apiResponse);
                })
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendUrl, "http://localhost:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept",
                "X-Requested-With", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        configuration.setExposedHeaders(List.of("Authorization", "Content-Disposition"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
