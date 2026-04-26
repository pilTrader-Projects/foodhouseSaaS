import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/sidebar'
import { RoleSwitcher } from '@/components/layout/role-switcher'

export const metadata: Metadata = {
  title: 'FoodHouse SaaS | Dashboard',
  description: 'Multi-branch management dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="dashboard-container">
          <Sidebar />
          
          <main className="main-content">
            <header className="header">
              <div className="breadcrumb text-sm font-bold text-slate-400">
                FoodHouse SaaS <span className="mx-2 text-slate-200">/</span> Operational Context
              </div>
              
              <div className="flex items-center gap-6">
                <RoleSwitcher />
                <div className="h-6 w-[1px] bg-slate-100"></div>
                <a href="/onboarding" className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Reset Demo</a>
              </div>
            </header>
            
            <section className="content-area">
              {children}
            </section>
          </main>
        </div>
      </body>
    </html>
  )
}
