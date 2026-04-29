'use client';

import React from 'react';
import { MoreVertical, ExternalLink, ShieldAlert } from 'lucide-react';
import styles from './admin.module.css';

interface Tenant {
    id: string;
    name: string;
    plan: string;
    status: string;
    createdAt: string;
    _count: {
        branches: number;
        users: number;
    };
}

interface TenantTableProps {
    tenants: Tenant[];
    onUpdatePlan: (id: string, plan: string) => void;
    onUpdateStatus: (id: string, status: string) => void;
}

export const TenantTable: React.FC<TenantTableProps> = ({ tenants, onUpdatePlan, onUpdateStatus }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Business Name</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Branches</th>
                        <th>Users</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.map((tenant) => (
                        <tr key={tenant.id}>
                            <td>
                                <div className={styles.tenantNameCell}>
                                    <span>{tenant.name}</span>
                                    {tenant.status === 'SUSPENDED' && (
                                        <ShieldAlert size={14} color="var(--text-danger)" />
                                    )}
                                </div>
                            </td>
                            <td>
                                <select 
                                    className={styles.planSelect}
                                    value={tenant.plan}
                                    onChange={(e) => onUpdatePlan(tenant.id, e.target.value)}
                                >
                                    <option value="basic">Basic</option>
                                    <option value="pro">Pro</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </td>
                            <td>
                                <span className={`${styles.badge} ${styles[tenant.status.toLowerCase()]}`}>
                                    {tenant.status}
                                </span>
                            </td>
                            <td>{tenant._count.branches}</td>
                            <td>{tenant._count.users}</td>
                            <td>{new Date(tenant.createdAt).toLocaleDateString()}</td>
                            <td>
                                <div className={styles.actionRow}>
                                    <button 
                                        className={styles.iconButton}
                                        onClick={() => onUpdateStatus(tenant.id, tenant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                                        title={tenant.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
