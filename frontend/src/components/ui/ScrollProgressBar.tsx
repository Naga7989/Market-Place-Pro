'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

export function ScrollProgressBar() {
  const scrollY = useMotionValue(0);
  const progress = useTransform(scrollY, (v) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? (v / docHeight) * 100 : 0;
  });

  const scaleX = useTransform(progress, [0, 100], [0, 1]);
  const springScaleX = useSpring(scaleX, { stiffness: 200, damping: 30 });

  const handleScroll = useCallback(() => {
    scrollY.set(window.scrollY);
  }, [scrollY]);

  useEffect(() => {
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
