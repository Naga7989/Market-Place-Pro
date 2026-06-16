package com.marketplace.service;

import com.marketplace.entity.*;
import com.marketplace.enums.ProductStatus;
import com.marketplace.exception.BadRequestException;
import com.marketplace.exception.ForbiddenException;
import com.marketplace.exception.ResourceNotFoundException;
import com.marketplace.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final VendorRepository vendorRepository;
    private final StoreRepository storeRepository;
    private final InventoryRepository inventoryRepository;
    private final ProductReviewRepository productReviewRepository;

    @Transactional(readOnly = true)
    public Product getProductById(Long productId) {
        return productRepository.findByIdAndStatus(productId, ProductStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
    }

    @Transactional(readOnly = true)
    public Page<Product> getProducts(Long categoryId, String categorySlug, BigDecimal minPrice, BigDecimal maxPrice,
                                      Double minRating, Boolean inStock, String sortBy, Pageable pageable) {
        if (categoryId != null) {
            return productRepository.findByCategoryIdAndStatus(categoryId, ProductStatus.ACTIVE, pageable);
        }
        if (categorySlug != null && !categorySlug.trim().isEmpty()) {
            Category category = categoryRepository.findBySlug(categorySlug)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + categorySlug));
            return productRepository.findByCategoryIdAndStatus(category.getId(), ProductStatus.ACTIVE, pageable);
        }
        if (minPrice != null && maxPrice != null) {
            return productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        }
        return productRepository.findByStatus(ProductStatus.ACTIVE, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Product> searchProducts(String query, Pageable pageable) {
        return productRepository.searchByName(query, pageable);
    }

    @Transactional(readOnly = true)
    public List<Product> getFeaturedProducts(int limit) {
        return productRepository.findByIsFeaturedTrueAndStatusOrderByCreatedAtDesc(
                ProductStatus.ACTIVE, PageRequest.of(0, limit));
    }

    @Transactional(readOnly = true)
    public List<Product> getBestSellers(int limit) {
        // ✅ Product has no isBestSeller field — sort by salesCount instead
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "salesCount"));
        return productRepository.findByStatus(ProductStatus.ACTIVE, pageable).getContent();
    }

    @Transactional(readOnly = true)
    public List<Product> getRelatedProducts(Long productId, int limit) {
        Product product = getProductById(productId);
        return productRepository.findRelatedProducts(
                product.getCategory().getId(), productId, ProductStatus.ACTIVE,
                PageRequest.of(0, limit));
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsByVendor(Long vendorId, Pageable pageable) {
        return productRepository.findByVendorId(vendorId, pageable);
    }

    @Transactional
    public Product createProduct(Long vendorId, Product productData, Long categoryId, Long storeId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor", vendorId));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", categoryId));

        productData.setVendor(vendor);
        productData.setCategory(category);
        productData.setStatus(ProductStatus.ACTIVE);

        if (storeId != null) {
            Store store = storeRepository.findById(storeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Store", storeId));
            productData.setStore(store);
        }

        // Calculate discount
        if (productData.getBasePrice() != null && productData.getSalePrice() != null
                && productData.getBasePrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discount = productData.getBasePrice().subtract(productData.getSalePrice())
                    .divide(productData.getBasePrice(), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            productData.setDiscountPercent(discount.max(BigDecimal.ZERO));
        }

        Product saved = productRepository.save(productData);

        // Create initial inventory record
        Inventory inventory = new Inventory();
        inventory.setProduct(saved);
        inventory.setQuantity(0);
        inventory.setReservedQuantity(0);
        inventoryRepository.save(inventory);

        log.info("Product created: {} by vendor: {}", saved.getId(), vendorId);
        return saved;
    }

    @Transactional
    public Product updateProduct(Long productId, Long vendorId, Product updates) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        if (!product.getVendor().getId().equals(vendorId)) {
            throw new ForbiddenException("You can only edit your own products");
        }

        if (updates.getName() != null) product.setName(updates.getName());
        if (updates.getDescription() != null) product.setDescription(updates.getDescription());
        if (updates.getSalePrice() != null) product.setSalePrice(updates.getSalePrice());
        if (updates.getBasePrice() != null) product.setBasePrice(updates.getBasePrice());
        if (updates.getStatus() != null) product.setStatus(updates.getStatus());
        if (updates.getIsFeatured() != null) product.setIsFeatured(updates.getIsFeatured());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long productId, Long vendorId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        if (!product.getVendor().getId().equals(vendorId)) {
            throw new ForbiddenException("You can only delete your own products");
        }

        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
        log.info("Product deactivated: {} by vendor: {}", productId, vendorId);
    }

    @Transactional
    public void updateInventory(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        Inventory inventory = inventoryRepository.findByProductIdAndVariantIdIsNull(productId)
                .orElseGet(() -> {
                    Inventory inv = new Inventory();
                    inv.setProduct(product);
                    inv.setReservedQuantity(0);
                    return inv;
                });

        inventory.setQuantity(quantity);
        inventoryRepository.save(inventory);

        if (quantity > 0 && product.getStatus() == ProductStatus.OUT_OF_STOCK) {
            product.setStatus(ProductStatus.ACTIVE);
            productRepository.save(product);
        } else if (quantity <= 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
            productRepository.save(product);
        }
    }
}
