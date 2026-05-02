'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { PageHeader } from '@/components/layout/page-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <PageHeader />
        
        <section className="content-area">
          {children}
        </section>
      </main>
    </div>
  );
}
