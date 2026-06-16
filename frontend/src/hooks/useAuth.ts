"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector, authActions } from "@/store";
import { authApi } from "@/lib/api";
import toast from "react-hot-toast";
import type { AuthTokens, User } from "@/types";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(authActions.setLoading(true));
      try {
        const response = await authApi.login(email, password);
        const { user, tokens } = response.data.data;
        dispatch(authActions.setUser({ user, tokens }));
        toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
        router.push("/");
        return { success: true };
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Login failed. Please check your credentials.";
        dispatch(authActions.setError(message));
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [dispatch, router]
  );

  const register = useCallback(
    async (data: { name: string; email: string; phone: string; password: string; role?: string }) => {
      dispatch(authActions.setLoading(true));
      try {
        const response = await authApi.register(data);
        const { user, tokens } = response.data.data;
        dispatch(authActions.setUser({ user, tokens }));
        toast.success("Account created successfully! Welcome aboard 🎉");
        router.push("/");
        return { success: true };
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Registration failed. Please try again.";
        dispatch(authActions.setError(message));
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [dispatch, router]
  );

  const loginWithTokens = useCallback(
    (user: User, tokens: AuthTokens) => {
      dispatch(authActions.setUser({ user, tokens }));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Silent fail — still logout locally
    } finally {
      dispatch(authActions.logout());
      router.push("/login");
      toast.success("Logged out successfully");
    }
  }, [dispatch, router]);

  const updateUser = useCallback(
    (data: Partial<User>) => {
      dispatch(authActions.updateUser(data));
    },
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    loginWithTokens,
    updateUser,
  };
}
