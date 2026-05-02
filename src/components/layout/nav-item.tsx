'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MenuItem } from '@/config/navigation';

interface NavItemProps {
  item: MenuItem;
  isActive: boolean;
}

export function NavItem({ item, isActive }: NavItemProps) {
  return (
    <Link 
      href={item.href}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
        isActive 
          ? 'bg-primary text-white shadow-glow' 
          : 'text-slate-500 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className={`p-2 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-white/10' 
          : 'bg-white/5 group-hover:bg-white/10'
      }`}>
        <item.icon size={20} />
      </div>
      <span className={`text-xs font-black uppercase tracking-widest transition-colors ${
        isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'
      }`}>
        {item.name}
      </span>
      {isActive && (
        <motion.div 
          layoutId="active-indicator"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" 
        />
      )}
    </Link>
  );
}
