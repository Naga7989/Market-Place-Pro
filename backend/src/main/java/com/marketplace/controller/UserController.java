package com.marketplace.controller;

import com.marketplace.dto.response.ApiResponse;
import com.marketplace.entity.Address;
import com.marketplace.entity.User;
import com.marketplace.repository.AddressRepository;
import com.marketplace.repository.UserRepository;
import com.marketplace.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "User Management", description = "User profile and address management APIs")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    @Operation(summary = "Get current user profile")
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(@AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @Operation(summary = "Get user addresses")
    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<Address>>> getAddresses(@AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success(addresses));
    }

    @Operation(summary = "Add a new shipping address")
    @PostMapping("/addresses")
    @Transactional
    public ResponseEntity<ApiResponse<Address>> addAddress(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        User user = userRepository.findById(currentUser.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = new Address();
        address.setUser(user);
        address.setAddressType((String) body.getOrDefault("addressType", "HOME"));
        address.setFullName((String) body.get("fullName"));
        address.setPhone((String) body.get("phone"));
        address.setAddressLine1((String) body.get("addressLine1"));
        address.setAddressLine2((String) body.get("addressLine2"));
        address.setCity((String) body.get("city"));
        address.setState((String) body.get("state"));
        address.setPincode((String) body.get("pincode"));
        address.setCountry((String) body.getOrDefault("country", "India"));
        
        boolean isDefault = body.get("isDefault") != null && Boolean.parseBoolean(body.get("isDefault").toString());
        address.setIsDefault(isDefault);

        if (isDefault) {
            // Reset existing defaults
            List<Address> defaults = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(currentUser.getUserId());
            for (Address d : defaults) {
                if (d.getIsDefault()) {
                    d.setIsDefault(false);
                    addressRepository.save(d);
                }
            }
        } else if (addressRepository.countByUserId(currentUser.getUserId()) == 0) {
            address.setIsDefault(true);
        }

        Address saved = addressRepository.save(address);
        return ResponseEntity.status(201).body(ApiResponse.success("Address added successfully", saved));
    }

    @Operation(summary = "Delete an address")
    @DeleteMapping("/addresses/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        addressRepository.deleteByIdAndUserId(id, currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", null));
    }
}
