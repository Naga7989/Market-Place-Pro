package com.marketplace.controller;

import com.marketplace.dto.response.ApiResponse;
import com.marketplace.dto.response.PageResponse;
import com.marketplace.entity.Category;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Categories", description = "Product category APIs")
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @Operation(summary = "Get all top-level categories")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        List<Category> categories = categoryRepository.findByParentIsNullAndIsActiveTrueOrderBySortOrderAsc();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @Operation(summary = "Get category by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @Operation(summary = "Get subcategories of a category")
    @GetMapping("/{id}/subcategories")
    public ResponseEntity<ApiResponse<List<Category>>> getSubcategories(@PathVariable Long id) {
        List<Category> subcategories = categoryRepository.findByParentIdAndIsActiveTrueOrderBySortOrderAsc(id);
        return ResponseEntity.ok(ApiResponse.success(subcategories));
    }
}
