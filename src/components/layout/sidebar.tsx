'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ChefHat, 
  Settings,
  Settings2,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  Loader2,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { useUser } from '@/context/user-context';

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, permissions, loading } = useUser();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', perm: 'access:dashboard' },
    { name: 'POS Terminal', icon: ShoppingCart, href: '/pos', perm: 'access:pos' },
    { name: 'Inventory', icon: Package, href: '/inventory', perm: 'access:inventory' },
    { name: 'Kitchen', icon: ChefHat, href: '/kitchen', perm: 'access:kitchen' },
    { name: 'Menu', icon: Settings2, href: '/settings/menu', perm: 'access:menu' },
    { name: 'Team', icon: Users, href: '/settings/team', perm: 'access:team' },
    { name: 'Branches', icon: MapPin, href: '/settings/branches', perm: 'manage:organization' },
    { name: 'Settings', icon: Settings, href: '/settings', perm: 'manage:settings' },
    { name: 'SaaS Admin', icon: ShieldCheck, href: '/admin/dashboard', perm: 'system:admin' },
  ];

  const visibleItems = menuItems.filter(item => {
    return permissions.includes(item.perm) || permissions.includes('tenant:admin');
  });

  if (loading) {
    return <aside className="sidebar opacity-50 flex-center"><Loader2 className="animate-spin text-white/20" /></aside>;
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <motion.div 
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          className="p-2 bg-primary rounded-lg text-white shadow-lg shadow-primary/20"
        >
          <ShieldCheck className="w-6 h-6" />
        </motion.div>
        <span className="font-black tracking-tighter uppercase text-white text-xl">FoodHouse</span>
      </div>

      {user && (
        <div className="px-8 py-10">
          <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex-center font-black text-white text-lg shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#070c1b] rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-white uppercase tracking-tight leading-none">{user.name}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{user.role.name}</span>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5"
          >
             <MapPin className="w-3.5 h-3.5 text-primary" />
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">{user.branch?.name || 'Grand HQ'}</span>
          </motion.div>
        </div>
      )}

      <nav className="sidebar-nav">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group border border-transparent ${
                isActive 
                  ? 'bg-primary/10 text-primary shadow-sm border-primary/20' 
                  : 'text-slate-500 hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-active)] hover:translate-x-1 hover:border-white/5 hover:shadow-lg'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-primary text-white shadow-glow' 
                  : 'bg-slate-500/10 group-hover:bg-primary/30 group-hover:text-primary group-hover:scale-110'
              }`}>
                <item.icon size={20} />
              </div>
              <span className={`text-xs font-black uppercase tracking-widest transition-colors ${
                isActive ? 'text-primary' : 'text-[var(--sidebar-text)] group-hover:text-[var(--sidebar-active)]'
              }`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button 
          onClick={toggleTheme} 
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-active)] transition-all duration-300 group w-full text-left"
        >
          <div className="p-2 rounded-lg bg-slate-500/5 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </div>
          <span className="text-xs font-black uppercase tracking-widest">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
        
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-300 group w-full text-left"
        >
          <div className="p-2 rounded-lg bg-slate-500/5 group-hover:bg-rose-500/20 transition-all duration-300">
            <LogOut size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 300px;
          height: 100vh;
          background-color: var(--sidebar-bg);
          color: var(--sidebar-text);
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.05);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .sidebar-brand {
          padding: 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-footer {
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>
    </aside>
  );
}
