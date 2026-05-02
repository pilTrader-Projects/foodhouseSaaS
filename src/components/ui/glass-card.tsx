'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlassCard({ 
  children, 
  className = '', 
  intensity = 'medium',
  ...props 
}: GlassCardProps) {
  const blurAmount = {
    low: '8px',
    medium: '16px',
    high: '24px'
  }[intensity];

  return (
    <motion.div
      {...props}
      className={`glass-card ${className}`}
      style={{
        backdropFilter: `blur(${blurAmount})`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backgroundColor: 'var(--bg-card)',
        opacity: 0.95,
        border: '1px solid var(--glass-border)',
        ...props.style
      }}
    >
      {children}
    </motion.div>
  );
}
