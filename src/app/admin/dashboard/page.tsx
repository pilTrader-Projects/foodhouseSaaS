'use client';

import React, { useEffect, useState } from 'react';
import { PlatformStats } from '@/modules/admin/components/PlatformStats';
import { TenantTable } from '@/modules/admin/components/TenantTable';
import styles from './page.module.css';
import { LayoutDashboard, Users, Settings, LogOut, Loader2 } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { user, permissions, loading: userLoading } = useUser();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'settings'>('overview');

    // Hardcoded admin ID for prototype was here - now using user.id from context

    useEffect(() => {
        if (userLoading) return;

        if (!user || !permissions.includes('system:admin')) {
            router.push('/login');
            return;
        }

        async function fetchData() {
            try {
                const userId = user?.id;
                const [statsRes, tenantsRes] = await Promise.all([
                    fetch('/api/admin/stats', { headers: { 'x-user-id': userId as string } }),
                    fetch('/api/admin/tenants', { headers: { 'x-user-id': userId as string } })
                ]);

                if (statsRes.ok && tenantsRes.ok) {
                    setStats(await statsRes.json());
                    setTenants(await tenantsRes.json());
                } else {
                    const errData = await statsRes.json().catch(() => ({}));
                    setError(errData.error || 'Failed to fetch platform data. Access Denied (403).');
                }
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
                setError('Connection failure. Please check your network.');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [user, userLoading, permissions, router]);

    const handleUpdatePlan = async (id: string, plan: string) => {
        try {
            const res = await fetch(`/api/admin/tenants/${id}`, {
                method: 'PATCH',
                headers: { 'x-user-id': user?.id as string, 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan })
            });
            if (res.ok) {
                setTenants(tenants.map(t => t.id === id ? { ...t, plan } : t));
                alert('Plan updated successfully');
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || 'Failed to update plan'}`);
            }
        } catch (e) {
            alert('Failed to connect to server');
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/tenants/${id}`, {
                method: 'PATCH',
                headers: { 'x-user-id': user?.id as string, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setTenants(tenants.map(t => t.id === id ? { ...t, status } : t));
                alert(`Tenant ${status.toLowerCase()} successfully`);
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || 'Failed to update status'}`);
            }
        } catch (e) {
            alert('Failed to connect to server');
        }
    };

    if (loading) return <div className={styles.loader}>Loading Platform Dashboard...</div>;

    return (
        <div className={styles.adminContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>FoodHouse <span>Admin</span></h2>
                </div>
                <nav className={styles.nav}>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Platform Overview</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('tenants')}
                        className={`${styles.navItem} ${activeTab === 'tenants' ? styles.active : ''}`}
                    >
                        <Users size={20} />
                        <span>Tenant Management</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')}
                        className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
                    >
                        <Settings size={20} />
                        <span>Global Settings</span>
                    </button>
                </nav>
                <div className={styles.sidebarFooter}>
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className={styles.logoutBtn}
                    >
                        <LogOut size={20} />
                        <span>Exit Admin</span>
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>
                        {activeTab === 'overview' && 'Platform Executive Overview'}
                        {activeTab === 'tenants' && 'Tenant Directory & Management'}
                        {activeTab === 'settings' && 'Global Platform Settings'}
                    </h1>
                    <div className={styles.userProfile}>
                        <span>System Administrator</span>
                        <div className={styles.avatar}>SA</div>
                    </div>
                </header>

                <div className={styles.content}>
                    {error && (
                        <div className={styles.errorBanner}>
                            <ShieldCheck size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {activeTab === 'overview' && stats && <PlatformStats stats={stats} />}
                    
                    {(activeTab === 'overview' || activeTab === 'tenants') && (
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Active Businesses</h2>
                                <button className={styles.primaryBtn}>Export Data</button>
                            </div>
                            <TenantTable 
                                tenants={tenants} 
                                onUpdatePlan={handleUpdatePlan}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        </section>
                    )}

                    {activeTab === 'settings' && (
                        <div className={styles.placeholderCard}>
                            <h3>System Configuration</h3>
                            <p>Global feature flags and system-wide maintenance controls will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
