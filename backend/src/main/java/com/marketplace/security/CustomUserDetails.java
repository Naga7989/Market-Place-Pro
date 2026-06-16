package com.marketplace.security;

import com.marketplace.entity.Role;
import com.marketplace.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Long userId;
    private final String email;
    private final String password;
    private final String fullName;
    private final boolean isActive;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.password = user.getPassword();  // ✅ User entity field is 'password'
        this.fullName = user.getFullName();
        this.isActive = user.getIsActive();

        this.authorities = user.getRoles().stream()
                .flatMap(role -> {
                    List<GrantedAuthority> auths = new java.util.ArrayList<>();
                    auths.add(new SimpleGrantedAuthority("ROLE_" + role.getName())); // ✅ getName() returns String
                    role.getPermissions().forEach(perm ->
                            auths.add(new SimpleGrantedAuthority(perm.getName())));
                    return auths.stream();
                })
                .collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}
