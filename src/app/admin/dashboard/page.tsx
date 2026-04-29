'use client';

import React, { useEffect, useState } from 'react';
import { PlatformStats } from '@/modules/admin/components/PlatformStats';
import { TenantTable } from '@/modules/admin/components/TenantTable';
import styles from './page.module.css';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Hardcoded admin ID for prototype. In real app, get from session.
    const ADMIN_USER_ID = 'admin-user-id'; 

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, tenantsRes] = await Promise.all([
                    fetch('/api/admin/stats', { headers: { 'x-user-id': ADMIN_USER_ID } }),
                    fetch('/api/admin/tenants', { headers: { 'x-user-id': ADMIN_USER_ID } })
                ]);

                if (statsRes.ok && tenantsRes.ok) {
                    setStats(await statsRes.json());
                    setTenants(await tenantsRes.json());
                }
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleUpdatePlan = async (id: string, plan: string) => {
        const res = await fetch(`/api/admin/tenants/${id}`, {
            method: 'PATCH',
            headers: { 'x-user-id': ADMIN_USER_ID, 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan })
        });
        if (res.ok) {
            setTenants(tenants.map(t => t.id === id ? { ...t, plan } : t));
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        const res = await fetch(`/api/admin/tenants/${id}`, {
            method: 'PATCH',
            headers: { 'x-user-id': ADMIN_USER_ID, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            setTenants(tenants.map(t => t.id === id ? { ...t, status } : t));
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
                    <a href="#" className={styles.navItem + ' ' + styles.active}>
                        <LayoutDashboard size={20} />
                        <span>Platform Overview</span>
                    </a>
                    <a href="#" className={styles.navItem}>
                        <Users size={20} />
                        <span>Tenant Management</span>
                    </a>
                    <a href="#" className={styles.navItem}>
                        <Settings size={20} />
                        <span>Global Settings</span>
                    </a>
                </nav>
                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Exit Admin</span>
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>Platform Executive Overview</h1>
                    <div className={styles.userProfile}>
                        <span>System Administrator</span>
                        <div className={styles.avatar}>SA</div>
                    </div>
                </header>

                <div className={styles.content}>
                    {stats && <PlatformStats stats={stats} />}
                    
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
                </div>
            </main>
        </div>
    );
}
