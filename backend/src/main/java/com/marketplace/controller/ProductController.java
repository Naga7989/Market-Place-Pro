package com.marketplace.controller;

import com.marketplace.dto.response.ApiResponse;
import com.marketplace.dto.response.PageResponse;
import com.marketplace.entity.Product;
import com.marketplace.security.CustomUserDetails;
import com.marketplace.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "Products", description = "Product catalog APIs")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Get paginated product list with optional filters")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Product>>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String categorySlug,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Sort sort = switch (sortBy) {
            case "price_asc" -> Sort.by("salePrice").ascending();
            case "price_desc" -> Sort.by("salePrice").descending();
            case "rating" -> Sort.by("averageRating").descending();
            default -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productService.getProducts(categoryId, categorySlug, minPrice, maxPrice, minRating, inStock, sortBy, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(products)));
    }

    @Operation(summary = "Search products by keyword")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<Product>>> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> results = productService.searchProducts(q, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(results)));
    }

    @Operation(summary = "Get featured products")
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Product>>> getFeaturedProducts(
            @RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(ApiResponse.success(productService.getFeaturedProducts(limit)));
    }

    @Operation(summary = "Get best selling products")
    @GetMapping("/best-sellers")
    public ResponseEntity<ApiResponse<List<Product>>> getBestSellers(
            @RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(ApiResponse.success(productService.getBestSellers(limit)));
    }

    @Operation(summary = "Get product by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id)));
    }

    @Operation(summary = "Get related products")
    @GetMapping("/{id}/related")
    public ResponseEntity<ApiResponse<List<Product>>> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "8") int limit) {
        return ResponseEntity.ok(ApiResponse.success(productService.getRelatedProducts(id, limit)));
    }

    @Operation(summary = "Create a new product (Seller only)")
    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Product>> createProduct(
            @RequestBody Product productData,
            @RequestParam Long categoryId,
            @RequestParam(required = false) Long storeId,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        // Get vendor ID from user (simplified - would lookup vendor by userId)
        Long vendorId = currentUser.getUserId(); // simplified
        Product created = productService.createProduct(vendorId, productData, categoryId, storeId);
        return ResponseEntity.status(201).body(ApiResponse.success("Product created successfully", created));
    }

    @Operation(summary = "Update a product (Seller only)")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updates,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Product updated = productService.updateProduct(id, currentUser.getUserId(), updates);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @Operation(summary = "Delete a product (Seller only)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        productService.deleteProduct(id, currentUser.getUserId());
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }
}
