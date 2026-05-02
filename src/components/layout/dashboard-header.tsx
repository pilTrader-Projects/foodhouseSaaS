'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/user-context';
import Link from 'next/link';
import { UserAvatar } from '../ui/user-avatar';

export function DashboardHeader() {
  const { user, loading, mounted } = useUser();

  const isLoading = !mounted || loading;

  return (
    <header className="dashboard-header glass-card !rounded-none !border-t-0 !border-x-0 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-main">
          {(mounted && user?.tenant?.name) ? user.tenant.name : 'Terminal'} <span className="opacity-20 px-2">/</span> Console
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {user && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-black text-main uppercase tracking-tight leading-none">{user.name}</div>
              <div className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1">Authorized</div>
            </div>
            <UserAvatar name={user.name} size="sm" className="!rounded-lg border border-primary/10 shadow-sm" />
          </motion.div>
        )}
        <div className="w-px h-6 bg-muted opacity-20"></div>
        <Link href="/onboarding" className="text-[10px] font-black uppercase text-muted hover:text-main transition-colors tracking-widest">
          Reset
        </Link>
      </div>

    </header>
  );
}
