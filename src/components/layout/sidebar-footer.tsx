'use client';

import React from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

interface SidebarFooterProps {
  onLogout: () => void;
}

export function SidebarFooter({ onLogout }: SidebarFooterProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sidebar-footer">
      <button 
        onClick={toggleTheme} 
        className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-white/5 hover:text-white transition-all duration-300 group w-full text-left"
      >
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-300">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </div>
        <span className="text-xs font-black uppercase tracking-widest">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </span>
      </button>
      
      <button 
        onClick={onLogout} 
        className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300 group w-full text-left"
      >
        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-rose-500/20 transition-all duration-300">
          <LogOut size={18} />
        </div>
        <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
      </button>
      
      <style jsx>{`
        .sidebar-footer {
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}
