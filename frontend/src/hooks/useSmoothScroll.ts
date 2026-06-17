'use client';

import { useCallback } from 'react';

/**
 * useSmoothScroll — returns a helper that scrolls smoothly to an element by ID or selector.
 * Falls back to native scroll-behavior: smooth if the browser doesn't support ScrollBehavior.
 */
export function useSmoothScroll() {
  const scrollTo = useCallback((target: string | HTMLElement | number, offset = 0) => {
    if (typeof window === 'undefined') return;

    let targetY: number;

    if (typeof target === 'number') {
      targetY = target;
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      targetY = rect.top + window.scrollY - offset;
    } else {
      const rect = target.getBoundingClientRect();
      targetY = rect.top + window.scrollY - offset;
    }

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { scrollTo, scrollToTop };
}
