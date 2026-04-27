'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ChefHat, 
  Settings,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  Loader2
} from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { useUser } from '@/context/user-context';

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, permissions, loading } = useUser();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', perm: 'access:dashboard' },
    { name: 'POS Terminal', icon: ShoppingCart, href: '/pos', perm: 'access:pos' },
    { name: 'Inventory', icon: Package, href: '/inventory', perm: 'access:inventory' },
    { name: 'Kitchen', icon: ChefHat, href: '/kitchen', perm: 'access:kitchen' },
    { name: 'Team', icon: Users, href: '/settings/team', perm: 'access:team' },
    { name: 'Settings', icon: Settings, href: '/settings', perm: 'manage:settings' },
  ];

  const visibleItems = menuItems.filter(item => {
    return permissions.includes(item.perm) || permissions.includes('tenant:admin');
  });

  if (loading) {
    return <aside className="sidebar opacity-50 flex-center"><Loader2 className="animate-spin text-white/20" /></aside>;
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="p-2 bg-white rounded-sm text-black">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <span className="font-black tracking-tight uppercase text-white">FoodHouse</span>
      </div>

      <nav className="sidebar-nav">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        
        <button onClick={handleLogout} className="theme-toggle opacity-50">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: 280px;
          height: 100vh;
          background-color: var(--sidebar-bg);
          color: var(--sidebar-text);
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.05);
          position: sticky;
          top: 0;
        }

        .sidebar-brand {
          padding: 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.5rem;
          border-radius: var(--radius-xs);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s;
          color: var(--sidebar-text);
        }

        .sidebar-link:hover {
          background-color: rgba(255,255,255,0.05);
          color: var(--sidebar-active);
        }

        .sidebar-link.active {
          background-color: rgba(255,255,255,0.1);
          color: var(--sidebar-active);
        }

        .sidebar-footer {
          padding: 1.5rem 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.5rem;
          width: 100%;
          background: none;
          border: none;
          color: var(--sidebar-text);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-toggle:hover {
          color: var(--sidebar-active);
          background-color: rgba(255,255,255,0.05);
        }
      `}</style>
    </aside>
  );
}
