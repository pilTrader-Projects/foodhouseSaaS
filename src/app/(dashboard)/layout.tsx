'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className="main-content">
        <DashboardHeader />
        
        <section className="content-area">
          {children}
        </section>
      </main>
    </div>
  );
}
