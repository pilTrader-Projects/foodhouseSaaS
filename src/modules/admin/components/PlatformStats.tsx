'use client';

import React from 'react';
import { Users, Globe, ShoppingBag, DollarSign } from 'lucide-react';
import styles from './admin.module.css';

interface StatsProps {
    stats: {
        totalTenants: number;
        activeTenants: number;
        totalOrders: number;
        totalRevenue: number;
    };
}

export const PlatformStats: React.FC<StatsProps> = ({ stats }) => {
    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <div className={styles.iconWrapper}>
                    <Globe size={24} color="var(--primary)" />
                </div>
                <div className={styles.statContent}>
                    <p className={styles.statLabel}>Total Tenants</p>
                    <h3 className={styles.statValue}>{stats.totalTenants}</h3>
                </div>
            </div>
            
            <div className={styles.statCard}>
                <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                    <Users size={24} color="#10b981" />
                </div>
                <div className={styles.statContent}>
                    <p className={styles.statLabel}>Active Tenants</p>
                    <h3 className={styles.statValue}>{stats.activeTenants}</h3>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                    <ShoppingBag size={24} color="#f59e0b" />
                </div>
                <div className={styles.statContent}>
                    <p className={styles.statLabel}>Total Orders</p>
                    <h3 className={styles.statValue}>{stats.totalOrders}</h3>
                </div>
            </div>

            <div className={styles.statCard}>
                <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                    <DollarSign size={24} color="#6366f1" />
                </div>
                <div className={styles.statContent}>
                    <p className={styles.statLabel}>Platform Revenue</p>
                    <h3 className={styles.statValue}>₱{stats.totalRevenue.toLocaleString()}</h3>
                </div>
            </div>
        </div>
    );
};
