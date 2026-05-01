import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';

// Mock the useApi hook
vi.mock('@/hooks/use-api', () => ({
  useApi: () => ({
    request: vi.fn().mockResolvedValue({ totalSales: 1000, performance: [], criticalStock: [] }),
    loading: false,
    error: null,
    errorType: null
  })
}));

// Mock useUser context
vi.mock('@/context/user-context', () => ({
  useUser: () => ({
    user: { id: 'u1', role: { name: 'Owner' } },
    permissions: ['access:dashboard'],
    loading: false
  })
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
  </>
);

describe('useDashboardStats Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default data', async () => {
    const { result } = renderHook(() => useDashboardStats(), { wrapper });
    
    expect(result.current.data.sales).toBe(0);
    expect(result.current.data.performance).toEqual([]);
  });
});
