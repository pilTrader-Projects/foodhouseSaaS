'use client';

import { Sidebar } from '@/components/layout/sidebar'
import { useTheme } from '@/context/theme-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="header">
          <div className="text-xs font-black uppercase tracking-widest text-muted">
            FoodHouse <span className="opacity-20 px-2">/</span> Management Console
          </div>
          
          <div className="flex items-center gap-6">
            <a href="/onboarding" className="text-xs font-black uppercase text-muted hover-main">System Reset</a>
          </div>
        </header>
        
        <section className="content-area">
          {children}
        </section>
      </main>

      <style jsx>{`
        .hover-main:hover { color: var(--text-main); }
      `}</style>
    </div>
  )
}
