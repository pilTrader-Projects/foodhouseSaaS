'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  BarChart3, 
  ShoppingCart, 
  Search, 
  Settings, 
  Users, 
  ChefHat, 
  Package,
  Truck,
  ShieldCheck,
  Loader2
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading, hasPermission, isRole } = usePermissions();

  if (loading) {
    return (
      <aside className="sidebar flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin opacity-20" />
      </aside>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, guard: () => isRole('Owner') || isRole('Manager') },
    { name: 'POS Terminal', href: '/pos', icon: ShoppingCart, guard: () => true },
    { name: 'Inventory', href: '/inventory', icon: Package, guard: () => isRole('Owner') || isRole('Manager') },
    { name: 'Receive Delivery', href: '/inventory/receive', icon: Truck, guard: () => isRole('Owner') || isRole('Manager') || isRole('Staff') },
    { name: 'Kitchen Display', href: '/kitchen', icon: ChefHat, guard: () => isRole('Owner') || isRole('Manager') || isRole('Chef') },
  ];

  const adminItems = [
    { name: 'Team', href: '/settings/team', icon: Users, guard: () => isRole('Owner') || isRole('Manager') },
    { name: 'Menu Settings', href: '/settings/menu', icon: Settings, guard: () => isRole('Owner') || isRole('Manager') },
  ];

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-3 px-4 mb-8">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="!p-0 leading-none">FoodHouse</h2>
          <span className="text-10 font-black text-slate-500 uppercase tracking-widest">{user?.tenant?.name || 'SaaS'}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-8">
        <div>
          <h3 className="px-4 text-10 font-black text-slate-500 uppercase tracking-widest mb-4">Operations</h3>
          <ul className="nav-links">
            {navItems.filter(item => item.guard()).map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`nav-item flex items-center gap-3 ${pathname === item.href ? 'active' : ''}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {(isRole('Owner') || isRole('Manager')) && (
          <div>
            <h3 className="px-4 text-10 font-black text-slate-500 uppercase tracking-widest mb-4">Management</h3>
            <ul className="nav-links">
              {adminItems.filter(item => item.guard()).map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`nav-item flex items-center gap-3 ${pathname === item.href ? 'active' : ''}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="mt-auto px-4 py-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-10 font-bold text-slate-500 uppercase tracking-wider">{user?.role?.name}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
