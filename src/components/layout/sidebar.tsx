'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useNavigation } from '@/hooks/use-navigation';
import { NavItem } from './nav-item';
import { SidebarFooter } from './sidebar-footer';
import { UserProfileWidget } from './user-profile-widget';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { items, isLoading } = useNavigation();

  if (isLoading) {
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

      {user && <UserProfileWidget user={user} />}

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavItem 
            key={item.name} 
            item={item} 
            isActive={pathname === item.href} 
          />
        ))}
      </nav>

      <SidebarFooter onLogout={handleLogout} />

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
      `}</style>
    </aside>
  );
}
