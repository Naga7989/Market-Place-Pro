import axios from 'axios';

let rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
rawBaseUrl = rawBaseUrl.replace(/\/+$/, '');
if (rawBaseUrl && !rawBaseUrl.endsWith('/api/v1')) {
  if (rawBaseUrl.endsWith('/api')) {
    rawBaseUrl += '/v1';
  } else {
    rawBaseUrl += '/api/v1';
  }
}

export const API_BASE_URL = rawBaseUrl;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('accessToken');
      if (!token) {
        const authTokensStr = localStorage.getItem('auth_tokens');
        if (authTokensStr) {
          try {
            const tokens = JSON.parse(authTokensStr);
            token = tokens?.accessToken;
          } catch (e) {
            console.error('Error parsing auth_tokens in request interceptor', e);
          }
        }
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired — try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        let refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          const authTokensStr = localStorage.getItem('auth_tokens');
          if (authTokensStr) {
            try {
              const tokens = JSON.parse(authTokensStr);
              refreshToken = tokens?.refreshToken;
            } catch (e) {
              console.error('Error parsing auth_tokens in response interceptor', e);
            }
          }
        }
        if (!refreshToken) {
          redirectToLogin();
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('auth_tokens', JSON.stringify({ accessToken, refreshToken: newRefreshToken }));
        if (typeof window !== 'undefined') {
          document.cookie = `access_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch {
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    // Network error
    if (!error.response) {
      error.message = 'Network error - please check your internet connection';
    }

    return Promise.reject(error);
  }
);

function redirectToLogin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    window.location.href = '/login';
  }
}

// Sub-API Exports to resolve typescript compile dependencies
export const authApi = {
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),
  register: (data: any) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  sendOtp: (phone: string, purpose: string) => apiClient.post('/auth/otp/send', { phone, purpose }),
  verifyOtp: (phone: string, otp: string) => apiClient.post('/auth/otp/verify', { phone, otp }),
  refresh: (refreshToken: string) => apiClient.post('/auth/refresh', { refreshToken }),
};

export const cartApi = {
  getCart: () =>
    apiClient.get('/cart')
      .then(res => {
        const cart = res.data?.data?.cart;
        const summary = res.data?.data?.summary;
        const items = cart?.items || [];
        return {
          data: {
            data: {
              items,
              summary
            }
          }
        };
      }),
  addToCart: (productId: string | number, quantity: number, variantId?: string | number) =>
    apiClient.post('/cart/items', { productId, quantity, variantId })
      .then(() => cartApi.getCart()),
  updateCartItem: (itemId: string | number, quantity: number) =>
    apiClient.put(`/cart/items/${itemId}`, { quantity })
      .then(() => cartApi.getCart()),
  removeFromCart: (itemId: string | number) =>
    apiClient.delete(`/cart/items/${itemId}`)
      .then(() => cartApi.getCart()),
  clearCart: () => apiClient.delete('/cart'),
  applyCoupon: (code: string) => Promise.resolve({
    data: {
      success: true,
      data: {
        code,
        discountType: 'flat' as 'flat' | 'percent',
        discountValue: 100,
      }
    }
  }),
  removeCoupon: () => Promise.resolve({
    data: {
      success: true,
      data: null
    }
  }),
};

export const notificationApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/notifications', { params })
      .then(res => {
        const content = res.data?.data?.content || [];
        return {
          data: {
            data: {
              data: content
            }
          }
        };
      }),
  getUnreadCount: () =>
    apiClient.get('/notifications/count')
      .then(res => {
        const count = res.data?.data?.unreadCount || 0;
        return {
          data: {
            data: {
              count
            }
          }
        };
      }),
  markRead: (id: string | number) => apiClient.put(`/notifications/${id}/read`),
  markAllRead: () => apiClient.put('/notifications/read-all'),
};

export const searchApi = {
  suggestions: (q: string) =>
    apiClient.get('/products/search', { params: { q, size: 10 } })
      .then(res => {
        const products = res.data?.data?.content || [];
        const suggestions = products.map((p: any) => ({
          text: p.name,
          type: 'product' as const
        }));
        return {
          data: {
            data: suggestions
          }
        };
      })
};

// Typed API methods
export const api = {
  auth: authApi,
  products: {
    list: (params?: object) => apiClient.get('/products', { params }),
    get: (id: number) => apiClient.get(`/products/${id}`),
    search: (query: string, params?: object) => apiClient.get('/products/search', { params: { q: query, ...params } }),
    featured: (limit = 12) => apiClient.get('/products/featured', { params: { limit } }),
    bestSellers: (limit = 12) => apiClient.get('/products/best-sellers', { params: { limit } }),
    related: (id: number, limit = 8) => apiClient.get(`/products/${id}/related`, { params: { limit } }),
    create: (data: object) => apiClient.post('/products', data),
    update: (id: number, data: object) => apiClient.put(`/products/${id}`, data),
    delete: (id: number) => apiClient.delete(`/products/${id}`),
  },
  cart: cartApi,
  orders: {
    create: (data: object) => apiClient.post('/orders', data),
    list: (params?: object) => apiClient.get('/orders', { params }),
    get: (id: number) => apiClient.get(`/orders/${id}`),
    cancel: (id: number) => apiClient.post(`/orders/${id}/cancel`),
  },
  payments: {
    createRazorpayOrder: (orderId: number) => apiClient.post(`/payments/razorpay/create/${orderId}`),
    verifyPayment: (data: object) => apiClient.post('/payments/razorpay/verify', data),
  },
  services: {
    list: (params?: object) => apiClient.get('/services/public', { params }),
    get: (id: number) => apiClient.get(`/services/${id}`),
    search: (query: string) => apiClient.get('/services/public', { params: { q: query } }),
    categories: () => apiClient.get('/services/categories'),
    book: (data: object) => apiClient.post('/bookings', data),
  },
  freelancers: {
    list: (params?: object) => apiClient.get('/freelancers', { params }),
    get: (id: number) => apiClient.get(`/freelancers/${id}`),
    projects: (params?: object) => apiClient.get('/projects', { params }),
    getProject: (id: number) => apiClient.get(`/projects/${id}`),
    postProject: (data: object) => apiClient.post('/projects', data),
    submitProposal: (projectId: number, data: object) => apiClient.post(`/projects/${projectId}/proposals`, data),
  },
  notifications: notificationApi,
  categories: {
    list: () => apiClient.get('/categories'),
    get: (id: number) => apiClient.get(`/categories/${id}`),
  },
};

export default apiClient;
