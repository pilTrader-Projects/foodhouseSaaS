'use client';

import React from 'react';
import { MoreVertical, ExternalLink, ShieldAlert, ShieldX, Eye, Trash2, CheckCircle } from 'lucide-react';
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
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onUpdatePlan: (id: string, plan: string) => void;
    onUpdateStatus: (id: string, status: string) => void;
    onDeleteTenant: (id: string) => void;
}

export const TenantTable: React.FC<TenantTableProps> = ({ 
    tenants, 
    selectedIds,
    onSelectionChange,
    onUpdatePlan, 
    onUpdateStatus, 
    onDeleteTenant 
}) => {
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

    const toggleAll = () => {
        if (selectedIds.length === tenants.length) {
            onSelectionChange([]);
        } else {
            onSelectionChange(tenants.map(t => t.id));
        }
    };

    const toggleOne = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(i => i !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        if (activeMenu) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [activeMenu]);

    const handleActionClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent immediate closing
        setActiveMenu(activeMenu === id ? null : id);
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{ width: '40px' }}>
                            <input 
                                type="checkbox" 
                                checked={tenants.length > 0 && selectedIds.length === tenants.length}
                                onChange={toggleAll}
                            />
                        </th>
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
                        <tr key={tenant.id} className={selectedIds.includes(tenant.id) ? styles.selectedRow : ''}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(tenant.id)}
                                    onChange={() => toggleOne(tenant.id)}
                                />
                            </td>
                            <td>
                                <div className={styles.tenantNameCell}>
                                    <span>{tenant.name}</span>
                                    {tenant.status === 'SUSPENDED' && (
                                        <ShieldAlert size={14} color="#ef4444" />
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
                                    <div className={styles.menuContainer}>
                                        <button 
                                            className={styles.iconButton}
                                            onClick={(e) => handleActionClick(e, tenant.id)}
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        
                                        {activeMenu === tenant.id && (
                                            <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                                                <button className={styles.menuItem} onClick={() => alert('View Details: ' + tenant.name)}>
                                                    <Eye size={16} />
                                                    <span>View Details</span>
                                                </button>
                                                
                                                {tenant.status === 'ACTIVE' ? (
                                                    <button 
                                                        className={styles.menuItem} 
                                                        onClick={() => { onUpdateStatus(tenant.id, 'SUSPENDED'); setActiveMenu(null); }}
                                                    >
                                                        <ShieldX size={16} />
                                                        <span>Suspend Access</span>
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className={styles.menuItem} 
                                                        onClick={() => { onUpdateStatus(tenant.id, 'ACTIVE'); setActiveMenu(null); }}
                                                    >
                                                        <CheckCircle size={16} />
                                                        <span>Reactivate Tenant</span>
                                                    </button>
                                                )}

                                                <button className={styles.menuItem} onClick={() => window.open(`/${tenant.id}`, '_blank')}>
                                                    <ExternalLink size={16} />
                                                    <span>Live Preview</span>
                                                </button>

                                                <div className={styles.menuDivider} />
                                                
                                                <button 
                                                    className={`${styles.menuItem} ${styles.danger}`} 
                                                    onClick={() => { if(confirm('Are you sure you want to delete this tenant? This action is irreversible.')) onDeleteTenant(tenant.id); setActiveMenu(null); }}
                                                >
                                                    <Trash2 size={16} />
                                                    <span>Delete Tenant</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
