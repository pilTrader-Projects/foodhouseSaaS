import { 
  Users, 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ChefHat, 
  Settings,
  UtensilsCrossed,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: any;
  href: string;
  permission: string;
}

export const ALL_MENU_ITEMS: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', permission: 'access:dashboard' },
  { name: 'POS Terminal', icon: ShoppingCart, href: '/pos', permission: 'access:pos' },
  { name: 'Inventory', icon: Package, href: '/inventory', permission: 'access:inventory' },
  { name: 'Kitchen', icon: ChefHat, href: '/kitchen', permission: 'access:kitchen' },
  { name: 'Menu', icon: UtensilsCrossed, href: '/settings/menu', permission: 'access:menu' },
  { name: 'Team', icon: Users, href: '/settings/team', permission: 'access:team' },
  { name: 'Branches', icon: MapPin, href: '/settings/branches', permission: 'manage:organization' },
  { name: 'Settings', icon: Settings, href: '/settings', permission: 'manage:settings' },
  { name: 'SaaS Admin', icon: ShieldCheck, href: '/admin/dashboard', permission: 'system:admin' },
];

/**
 * Filters menu items based on user permissions.
 * This is the single source of truth for navigation visibility.
 */
export function getAuthorizedNavItems(permissions: string[]): MenuItem[] {
  // If user has system:admin, they see everything including SaaS Admin
  if (permissions.includes('system:admin')) {
    return ALL_MENU_ITEMS;
  }

  // Otherwise, filter by specific permissions, excluding SaaS Admin which requires system:admin
  return ALL_MENU_ITEMS.filter(item => {
    // Explicitly hide SaaS Admin from non-system admins even if they have some wildcard
    if (item.permission === 'system:admin') return false;

    return permissions.includes(item.permission) || permissions.includes('tenant:admin');
  });
}
