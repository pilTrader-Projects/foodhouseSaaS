'use client';

import React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { useUser } from '@/context/user-context'
import { motion } from 'framer-motion'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useUser();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="header glass-card !rounded-none !border-t-0 !border-x-0 sticky top-0 z-40">
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
                <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center font-black text-primary text-xs border border-primary/10 shadow-sm">
                  {user.name.charAt(0)}
                </div>
              </motion.div>
            )}
            <div className="w-px h-6 bg-muted opacity-20"></div>
            <a href="/onboarding" className="text-[10px] font-black uppercase text-muted hover-main tracking-widest">Reset</a>
          </div>
        </header>
        
        <section className="content-area">
          {children}
        </section>
      </main>

      <style jsx>{`
        .hover-main:hover { color: var(--text-main); }
        .header {
           height: 4.5rem;
           background: var(--glass-bg);
           backdrop-filter: blur(20px);
           -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  )
}
