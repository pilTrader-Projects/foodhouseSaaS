'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ChefHat, 
  Settings,
  Settings2,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  Loader2,
  MapPin,
  X,
  Menu
} from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { useUser } from '@/context/user-context';

export function Sidebar({ 
  isCollapsed, 
  onCollapse, 
  isMobileOpen, 
  onMobileClose 
}: { 
  isCollapsed: boolean, 
  onCollapse: () => void,
  isMobileOpen: boolean,
  onMobileClose: () => void
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, permissions, loading } = useUser();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', perm: 'access:dashboard' },
    { name: 'POS Terminal', icon: ShoppingCart, href: '/pos', perm: 'access:pos' },
    { name: 'Inventory', icon: Package, href: '/inventory', perm: 'access:inventory' },
    { name: 'Kitchen', icon: ChefHat, href: '/kitchen', perm: 'access:kitchen' },
    { name: 'Menu', icon: Settings2, href: '/settings/menu', perm: 'access:menu' },
    { name: 'Team', icon: Users, href: '/settings/team', perm: 'access:team' },
    { name: 'Settings', icon: Settings, href: '/settings', perm: 'manage:settings' },
  ];

  const visibleItems = menuItems.filter(item => {
    return permissions.includes(item.perm) || permissions.includes('tenant:admin');
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      {/* Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onMobileClose}
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand flex-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="p-2 bg-white rounded-sm text-black shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            {!isCollapsed && <span className="font-black tracking-tight uppercase text-white truncate">FoodHouse</span>}
          </div>
          
          <button 
            onClick={onCollapse}
            className="hidden lg:flex p-1.5 hover:bg-white/5 rounded-sm text-white/40 hover:text-white transition-colors"
          >
            <Menu size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex-center">
            <Loader2 className="animate-spin text-white/20" />
          </div>
        ) : (
          <>
            {user && (
              <div className={`px-6 py-8 border-b border-white/5 ${isCollapsed ? 'flex-center' : ''}`}>
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 bg-white/10 rounded-sm flex-center font-black text-white text-lg shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black text-white uppercase tracking-tight truncate">{user.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{user.role.name}</span>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-white/5 rounded-sm overflow-hidden">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest truncate">{user.branch?.name || 'Grand HQ'}</span>
                  </div>
                )}
              </div>
            )}

            <nav className="sidebar-nav">
              {visibleItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={onMobileClose}
                    className={`sidebar-link ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <item.icon size={18} className="shrink-0" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>

            <div className="sidebar-footer">
              <button onClick={toggleTheme} className={`theme-toggle ${isCollapsed ? 'justify-center px-0' : ''}`} title={isCollapsed ? 'Toggle Theme' : ''}>
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                {!isCollapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
              </button>
              
              <button onClick={handleLogout} className={`theme-toggle opacity-50 ${isCollapsed ? 'justify-center px-0' : ''}`} title={isCollapsed ? 'Sign Out' : ''}>
                <LogOut size={18} />
                {!isCollapsed && <span>Sign Out</span>}
              </button>
            </div>
          </>
        )}

        <style jsx>{`
          .sidebar {
            width: 280px;
            height: 100vh;
            background-color: var(--sidebar-bg);
            color: var(--sidebar-text);
            display: flex;
            flex-direction: column;
            border-right: 1px solid rgba(255,255,255,0.05);
            position: fixed;
            left: 0;
            top: 0;
            z-index: 45;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .sidebar.collapsed {
            width: 80px;
          }

          @media (min-width: 1024px) {
            .sidebar {
              position: sticky;
              transform: none;
            }
          }

          .sidebar-brand {
            padding: 2rem;
            min-height: 80px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }

          .sidebar.collapsed .sidebar-brand {
            padding: 1rem;
            justify-content: center;
          }

          .sidebar-nav {
            flex: 1;
            padding: 1.5rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            overflow-y: auto;
          }

          .sidebar.collapsed .sidebar-nav {
            padding: 1.5rem 0.5rem;
          }

          .sidebar-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.875rem 1.25rem;
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
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .sidebar-footer {
            padding: 1.5rem 1rem;
            border-top: 1px solid rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .sidebar.collapsed .sidebar-footer {
            padding: 1.5rem 0.5rem;
          }

          .theme-toggle {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.875rem 1.25rem;
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
    </>
  );
}
