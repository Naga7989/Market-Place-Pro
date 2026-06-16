package com.marketplace.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Bean
    public OpenAPI marketplaceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MarketPlace Pro API")
                        .description("Enterprise Multi-Vendor Marketplace REST API — Products, Services, Freelancers, Orders & Payments")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MarketPlace Pro")
                                .email("api@marketplace.in")
                                .url("https://marketplace.in"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://marketplace.in/terms")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development"),
                        new Server().url("https://api.marketplace.in").description("Production")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT token from /auth/login response")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
