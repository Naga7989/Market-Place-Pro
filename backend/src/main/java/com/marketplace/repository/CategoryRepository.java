package com.marketplace.repository;

import com.marketplace.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIsNullAndIsActiveTrueOrderBySortOrderAsc();
    List<Category> findByParentIdAndIsActiveTrueOrderBySortOrderAsc(Long parentId);
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);

    // ✅ Category has no 'level' field — order by parent (nulls first) then sortOrder
    @Query("SELECT c FROM Category c WHERE c.isActive = true ORDER BY c.sortOrder ASC")
    List<Category> findAllActiveOrderByLevelAndSort();
}
