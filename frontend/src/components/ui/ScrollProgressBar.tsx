'use client';

import { useEffect, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export function ScrollProgressBar() {
  // Start at 0 — computed only inside useEffect (browser-safe)
  const rawProgress = useMotionValue(0);
  // Convert 0–100 range to scaleX 0–1
  const scaleX = useTransform(rawProgress, [0, 100], [0, 1]);
  const springScaleX = useSpring(scaleX, { stiffness: 200, damping: 30 });

  const handleScroll = useCallback(() => {
    // Safe: called only from useEffect / event listener (browser only)
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    rawProgress.set(pct);
  }, [rawProgress]);

  useEffect(() => {
    // Initialise on mount
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
      style={{
        scaleX: springScaleX,
        background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
      }}
    />
  );
}
