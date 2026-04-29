'use client';

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { useUser } from '@/context/user-context'
import { Menu } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="main-content">
        <header className="header">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-muted hover:text-main transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted truncate">
              FoodHouse <span className="opacity-20 px-1 sm:px-2">/</span> Console
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            {user && (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex w-8 h-8 bg-surface rounded-sm items-center justify-center font-black text-main text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col text-right sm:text-left">
                  <span className="text-[10px] sm:text-xs font-black text-main uppercase tracking-tight leading-none truncate max-w-[80px] sm:max-w-none">{user.name}</span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{user.role.name}</span>
                </div>
              </div>
            )}
            <div className="hidden sm:block w-px h-6 bg-muted opacity-20"></div>
            <a href="/onboarding" className="text-[10px] sm:text-xs font-black uppercase text-muted hover-main transition-colors">Reset</a>
          </div>
        </header>
        
        <section className="content-area">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </section>
      </main>

      <style jsx>{`
        .hover-main:hover { color: var(--text-main); }
      `}</style>
    </div>
  )
}
