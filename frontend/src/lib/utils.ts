import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian Rupee currency
 */
export function formatPrice(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format a date to locale string
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', options ?? {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = (d.getTime() - Date.now()) / 1000;

  if (Math.abs(diff) < 60) return rtf.format(Math.round(diff), 'second');
  if (Math.abs(diff) < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (Math.abs(diff) < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (Math.abs(diff) < 86400 * 7) return rtf.format(Math.round(diff / 86400), 'day');
  return formatDate(d);
}

/**
 * Truncate a string to max length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(original: number, selling: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - selling) / original) * 100);
}

/**
 * Format large numbers compactly (e.g., 12500 -> "12.5K")
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get user initials for avatar
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');
}

/**
 * Validate Indian mobile number
 */
export function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

/**
 * Validate GST number
 */
export function isValidGst(gst: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
}

/**
 * Parse JWT payload (client-side, non-verified)
 */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= (payload.exp as number) * 1000;
}

/**
 * Safe local storage wrapper for SSR / Next.js
 */
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  },
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },
};

/**
 * Safe utility to extract the normalized user role from either user.role or user.roles
 */
export function getUserRole(user: any): string {
  if (!user) return "";
  if (user.role) return user.role;
  if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    const primary = user.roles[0]?.toUpperCase();
    if (primary === "SELLER" || primary === "VENDOR") return "vendor";
    if (primary === "ADMIN" || primary === "SUPER_ADMIN") return "admin";
    if (primary === "SERVICE_PROVIDER") return "service_provider";
    if (primary === "FREELANCER") return "freelancer";
  }
  return "customer";
}

