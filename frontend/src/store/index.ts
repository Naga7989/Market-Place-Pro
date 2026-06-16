import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { User, AuthTokens, CartItem, CartSummary, Notification } from "@/types";
import { storage } from "@/lib/utils";

// ============================================================
// AUTH SLICE
// ============================================================
interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storage.get<User>("auth_user"),
    tokens: storage.get<AuthTokens>("auth_tokens"),
    isAuthenticated: !!storage.get<AuthTokens>("auth_tokens")?.accessToken,
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.error = null;
      storage.set("auth_user", action.payload.user);
      storage.set("auth_tokens", action.payload.tokens);
      if (typeof window !== 'undefined') {
        localStorage.setItem("accessToken", action.payload.tokens.accessToken);
        localStorage.setItem("refreshToken", action.payload.tokens.refreshToken);
        document.cookie = `access_token=${action.payload.tokens.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      }
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        storage.set("auth_user", state.user);
      }
    },
    setTokens(state, action: PayloadAction<AuthTokens>) {
      state.tokens = action.payload;
      storage.set("auth_tokens", action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        document.cookie = `access_token=${action.payload.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.remove("auth_user");
      storage.remove("auth_tokens");
      if (typeof window !== 'undefined') {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      }
    },
  },
});

// ============================================================
// CART SLICE
// ============================================================
interface CartState {
  items: CartItem[];
  summary: CartSummary;
  couponCode: string | null;
  loading: boolean;
  error: string | null;
}

const defaultSummary: CartSummary = {
  subtotal: 0,
  discount: 0,
  deliveryCharge: 0,
  gst: 0,
  total: 0,
  savings: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    summary: defaultSummary,
    couponCode: null,
    loading: false,
    error: null,
  } as CartState,
  reducers: {
    setCart(state, action: PayloadAction<{ items: CartItem[]; summary: CartSummary }>) {
      state.items = action.payload.items;
      state.summary = action.payload.summary;
    },
    setCartLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCartError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setCoupon(state, action: PayloadAction<string | null>) {
      state.couponCode = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.summary = defaultSummary;
      state.couponCode = null;
    },
    updateItemQuantity(state, action: PayloadAction<{ itemId: string; quantity: number }>) {
      const item = state.items.find((i) => i.id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

// ============================================================
// UI SLICE
// ============================================================
interface UIState {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  searchOpen: boolean;
  chatOpen: boolean;
  chatRoomId: string | null;
  activeModal: string | null;
  toasts: Array<{ id: string; message: string; type: "success" | "error" | "info" | "warning" }>;
}

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: "dark",
    sidebarOpen: false,
    searchOpen: false,
    chatOpen: false,
    chatRoomId: null,
    activeModal: null,
    toasts: [],
  } as UIState,
  reducers: {
    setTheme(state, action: PayloadAction<"light" | "dark" | "system">) {
      state.theme = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSearch(state) {
      state.searchOpen = !state.searchOpen;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },
    openChat(state, action: PayloadAction<string | null>) {
      state.chatOpen = true;
      state.chatRoomId = action.payload;
    },
    closeChat(state) {
      state.chatOpen = false;
      state.chatRoomId = null;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

// ============================================================
// NOTIFICATION SLICE
// ============================================================
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
  } as NotificationState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    setNotificationsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

// ============================================================
// STORE SETUP
// ============================================================
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartSlice.reducer,
    ui: uiSlice.reducer,
    notifications: notificationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export actions
export const authActions = authSlice.actions;
export const cartActions = cartSlice.actions;
export const uiActions = uiSlice.actions;
export const notificationActions = notificationSlice.actions;
