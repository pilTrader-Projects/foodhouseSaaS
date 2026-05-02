'use client';

import { useUser } from '@/context/user-context';
import { MenuItem } from '@/config/navigation';

/**
 * Custom hook to consume authorized navigation items.
 * Centralizes navigation logic and provides a clean interface for UI components.
 */
export function useNavigation() {
  const { navigation, loading } = useUser();

  return {
    items: navigation,
    isLoading: loading
  };
}
