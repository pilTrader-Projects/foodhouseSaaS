import { Sidebar } from '@/components/layout/sidebar'
import { RoleSwitcher } from '@/components/layout/role-switcher'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <header className="header" style={{ borderBottom: '1px solid var(--border)', background: 'white' }}>
          <div className="breadcrumb" style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            FoodHouse <span style={{ margin: '0 0.5rem', opacity: 0.2 }}>/</span> Management Console
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <RoleSwitcher />
            <div style={{ width: '1px', height: '1.5rem', background: 'var(--border-light)' }}></div>
            <a href="/onboarding" style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--slate-400)', textDecoration: 'none' }}>System Reset</a>
          </div>
        </header>
        
        <section className="content-area">
          {children}
        </section>
      </main>
    </div>
  )
}
