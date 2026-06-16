"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector, cartActions } from "@/store";
import { cartApi } from "@/lib/api";
import toast from "react-hot-toast";

export function useCart() {
  const dispatch = useAppDispatch();
  const { items, summary, couponCode, loading } = useAppSelector((state) => state.cart);

  const fetchCart = useCallback(async () => {
    dispatch(cartActions.setCartLoading(true));
    try {
      const response = await cartApi.getCart();
      const { items, summary } = response.data.data;
      dispatch(cartActions.setCart({ items, summary }));
    } catch {
      dispatch(cartActions.setCartError("Failed to load cart"));
    }
  }, [dispatch]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1, variantId?: string) => {
      dispatch(cartActions.setCartLoading(true));
      try {
        const response = await cartApi.addToCart(productId, quantity, variantId);
        const { items, summary } = response.data.data;
        dispatch(cartActions.setCart({ items, summary }));
        toast.success("Added to cart!");
        return true;
      } catch {
        toast.error("Failed to add item. Please try again.");
        dispatch(cartActions.setCartLoading(false));
        return false;
      }
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      dispatch(cartActions.updateItemQuantity({ itemId, quantity }));
      try {
        const response = await cartApi.updateCartItem(itemId, quantity);
        const { items, summary } = response.data.data;
        dispatch(cartActions.setCart({ items, summary }));
      } catch {
        toast.error("Failed to update quantity");
      }
    },
    [dispatch]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      dispatch(cartActions.removeItem(itemId));
      try {
        const response = await cartApi.removeFromCart(itemId);
        const { items, summary } = response.data.data;
        dispatch(cartActions.setCart({ items, summary }));
        toast.success("Item removed from cart");
      } catch {
        toast.error("Failed to remove item");
      }
    },
    [dispatch]
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      try {
        const response = await cartApi.applyCoupon(code);
        const coupon = response.data.data;
        dispatch(cartActions.setCoupon(code));
        toast.success(`Coupon applied! You save ${coupon.discountValue}${coupon.discountType === "percent" ? "%" : "₹"}`);
        await fetchCart();
        return { success: true };
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Invalid coupon code";
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [dispatch, fetchCart]
  );

  const removeCoupon = useCallback(async () => {
    try {
      await cartApi.removeCoupon();
      dispatch(cartActions.setCoupon(null));
      await fetchCart();
      toast.success("Coupon removed");
    } catch {
      toast.error("Failed to remove coupon");
    }
  }, [dispatch, fetchCart]);

  const clearCart = useCallback(() => {
    dispatch(cartActions.clearCart());
  }, [dispatch]);

  return {
    items,
    summary,
    couponCode,
    loading,
    itemCount: summary.itemCount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
  };
}
