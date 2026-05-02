'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { PageHeader } from '@/components/layout/page-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="dashboard-container">
      <div 
        className={`sidebar-backdrop ${isSidebarOpen ? 'visible' : ''}`} 
        onClick={closeSidebar}
      />
      
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="main-content">
        <PageHeader onMenuClick={toggleSidebar} />
        
        <section className="content-area">
          {children}
        </section>
      </main>
    </div>
  );
}
