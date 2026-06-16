package com.marketplace.dto.response;

import com.marketplace.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String avatarUrl;
    private Boolean isEmailVerified;
    private Boolean isPhoneVerified;
    private Set<String> roles;
}
