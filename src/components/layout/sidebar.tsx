'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { NavItem } from './nav-item';
import { SidebarFooter } from './sidebar-footer';
import { UserProfileWidget } from './user-profile-widget';

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading, mounted, navigation } = useUser();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const isLoading = !mounted || loading;

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

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center opacity-50">
          <Loader2 className="animate-spin text-white/20" />
        </div>
      ) : (
        <>
          {user && <UserProfileWidget user={user} />}

          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <NavItem 
                key={item.name} 
                item={item} 
                isActive={pathname === item.href} 
              />
            ))}
          </nav>

          <SidebarFooter onLogout={handleLogout} />
        </>
      )}
    </aside>
  );
}
