package com.marketplace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserSummaryDto user;
    @Builder.Default
    private String tokenType = "Bearer";
    private long expiresIn; // in seconds
}
