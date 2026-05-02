'use client';

import { useState, useEffect } from 'react';
import { Shield, MapPin, BadgeCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RBACGate } from '@/components/auth/rbac-gate';
import { useUser } from '@/context/user-context';
import { PersonnelList } from './sections/PersonnelList';
import { PositionManager } from './sections/PositionManager';
import { InviteForm } from './sections/InviteForm';
import { ROLES } from '@/lib/constants';

export default function TeamManagementPage() {
  return (
    <RBACGate permission="access:team" redirectOnFail="/dashboard">
      <TeamManagementContent />
    </RBACGate>
  );
}

function TeamManagementContent() {
  const { user: currentUser } = useUser();
  const [employees, setEmployees] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personnel' | 'positions'>('personnel');

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || 'tenant-demo' : 'tenant-demo';

  useEffect(() => {
    async function init() {
      try {
        const [teamRes, branchRes, roleRes] = await Promise.all([
          fetch('/api/team', { headers: { 'x-tenant-id': tenantId } }),
          fetch('/api/branches', { headers: { 'x-tenant-id': tenantId } }),
          fetch('/api/team/roles', { headers: { 'x-user-id': currentUser?.id || 'user-admin' } }),
        ]);

        const teamData = await teamRes.json();
        const branchData = await branchRes.json();
        const roleData = await roleRes.json();

        setEmployees(teamData.team || []);
        setBranches(branchData.branches || []);
        setRoles(roleData.roles || []);
      } catch (e) {
        console.error("Failed to load team data", e);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) init();
  }, [tenantId, currentUser]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="page-title">
            <span className="text-gradient">Organization</span> Core
          </h1>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest mt-2">Personnel and Position Management</p>
        </div>
        <div className="flex bg-slate-100 p-1" style={{ borderRadius: '4px' }}>
          <button 
            onClick={() => setActiveTab('personnel')}
            className={`px-6 py-2 text-xs font-black uppercase transition-all ${activeTab === 'personnel' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          > Personnel </button>
          <button 
            onClick={() => setActiveTab('positions')}
            className={`px-6 py-2 text-xs font-black uppercase transition-all ${activeTab === 'positions' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          > Positions </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          {activeTab === 'personnel' ? (
            <PersonnelList employees={employees} loading={loading} />
          ) : (
            <PositionManager 
                roles={roles} 
                userId={currentUser?.id || ''} 
                onRoleCreated={(role) => setRoles(prev => [...prev, role])} 
            />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <InviteForm 
            roles={roles} 
            branches={branches} 
            tenantId={tenantId}
            onSuccess={(newEmp) => setEmployees(prev => [newEmp, ...prev])} 
          />
          
          <div className="p-8 border border-slate-200 rounded-sm bg-white">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Organization Capacity</h4>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Personnel Seats</span>
                <span className="text-xs font-black">{employees.length} / 15</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${(employees.length / 15) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
