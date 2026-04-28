'use client';

import { Sidebar } from '@/components/layout/sidebar'
import { useUser } from '@/context/user-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser();
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="header">
          <div className="text-xs font-black uppercase tracking-widest text-muted">
            FoodHouse <span className="opacity-20 px-2">/</span> Management Console
          </div>
          
          <div className="flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-surface rounded-sm flex items-center justify-center font-black text-main text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-main uppercase tracking-tight leading-none">{user.name}</span>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{user.role.name}</span>
                </div>
              </div>
            )}
            <div className="w-px h-6 bg-muted opacity-20"></div>
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
