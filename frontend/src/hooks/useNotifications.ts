"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector, notificationActions } from "@/store";
import { notificationApi } from "@/lib/api";

export function useNotifications() {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading } = useAppSelector((state) => state.notifications);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    dispatch(notificationActions.setNotificationsLoading(true));
    try {
      const response = await notificationApi.getAll({ limit: 20 });
      dispatch(notificationActions.setNotifications(response.data.data.data));
    } catch {
      // Silent fail
    } finally {
      dispatch(notificationActions.setNotificationsLoading(false));
    }
  }, [dispatch, isAuthenticated]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await notificationApi.getUnreadCount();
      dispatch(notificationActions.setUnreadCount(response.data.data.count));
    } catch {
      // Silent fail
    }
  }, [dispatch, isAuthenticated]);

  const markRead = useCallback(
    async (id: string) => {
      dispatch(notificationActions.markAsRead(id));
      try {
        await notificationApi.markRead(id);
      } catch {
        // Silent fail
      }
    },
    [dispatch]
  );

  const markAllRead = useCallback(async () => {
    dispatch(notificationActions.markAllAsRead());
    try {
      await notificationApi.markAllRead();
    } catch {
      // Silent fail
    }
  }, [dispatch]);

  // Poll for unread count every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount, isAuthenticated]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markRead,
    markAllRead,
  };
}
