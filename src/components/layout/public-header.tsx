'use client';

import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock,
  Moon,
  Sun
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/context/theme-context';

export function PublicHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav 
      className="fixed-top w-full"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-nowrap items-center gap-8 md:gap-12">
        <Link href="/" className="flex flex-nowrap items-center gap-3 hover:opacity-80 transition-opacity shrink-0">
          <div className="p-2 bg-gradient-to-br from-primary to-accent-glow rounded-xl text-white shadow-[0_0_30px_var(--primary-glow)]">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase font-sans text-[var(--text-main)] whitespace-nowrap">FoodHouse</h1>
        </Link>

        <a href="/#features" className="text-[10px] md:text-[11px] font-black text-[var(--text-muted)] hover:text-white uppercase tracking-[0.2em] transition-colors whitespace-nowrap">Features</a>
        
        <div className="flex-1" />
        
        <div className="flex flex-nowrap items-center gap-4 md:gap-8 py-2">
          <Link href="/onboarding" className="inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-2.5 bg-white text-black hover:bg-white/90 transition-all rounded-full whitespace-nowrap text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider">
            Get Started
          </Link>
          <button 
            onClick={toggleTheme}
            className="p-2 text-[var(--text-muted)] hover:text-white bg-white/5 rounded-full transition-all hover:scale-110 shrink-0"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <Link href="/login" className="text-[10px] md:text-[11px] font-black text-[var(--text-muted)] hover:text-white uppercase tracking-[0.2em] transition-colors whitespace-nowrap">
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}
