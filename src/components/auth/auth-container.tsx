'use client';

import { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  showIcon?: boolean;
  maxWidth?: 'md' | 'xl' | '2xl';
}

export function AuthContainer({ 
  title, 
  subtitle, 
  children, 
  showIcon = true,
  maxWidth = 'md' 
}: AuthContainerProps) {
  const maxWidthClass = {
    md: 'max-w-md',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }[maxWidth];

  return (
    <div className="min-h-screen bg-app flex flex-col items-center pt-52 p-4 animate-fade-in">
      <div className={`${maxWidthClass} w-full flex flex-col gap-10`}>
        
        {/* Standardized Header */}
        <div className="flex flex-col items-center text-center gap-4">
          {showIcon && (
            <div className="p-4 bg-primary text-white shadow-glow rounded-[12px] w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
          )}
          <div>
            <h1 className="font-serif text-4xl font-black text-main tracking-tight">
              {title}
            </h1>
            <p className="text-xs font-bold text-muted uppercase tracking-widest mt-2">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
