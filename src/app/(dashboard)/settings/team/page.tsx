'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  MapPin, 
  Mail, 
  BadgeCheck,
  Loader2,
  Trash2,
  Briefcase,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamManagementPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'personnel' | 'positions'>('personnel');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleName: '',
    branchId: '',
  });

  const [newRoleName, setNewRoleName] = useState('');

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || 'tenant-demo' : 'tenant-demo';
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || 'user-admin' : 'user-admin';

  useEffect(() => {
    async function init() {
      try {
        const [teamRes, branchRes, roleRes] = await Promise.all([
          fetch('/api/team', { headers: { 'x-tenant-id': tenantId } }),
          fetch('/api/branches', { headers: { 'x-tenant-id': tenantId } }),
          fetch('/api/team/roles', { headers: { 'x-user-id': userId } }),
        ]);

        const teamData = await teamRes.json();
        const branchData = await branchRes.json();
        const roleData = await roleRes.json();

        setEmployees(teamData.team || []);
        setBranches(branchData.branches || []);
        const tenantRoles = roleData.roles || [];
        setRoles(tenantRoles);
        
        // Default form values
        setFormData(prev => ({ 
          ...prev, 
          branchId: branchData.branches?.[0]?.id || '',
          roleName: tenantRoles?.[0]?.name || 'Staff'
        }));
      } catch (e) {
        console.error("Failed to load team data", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [tenantId, userId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId 
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to invite member');
      }

      const { user } = await res.json();
      setEmployees(prev => [user, ...prev]);
      setFormData(prev => ({ ...prev, name: '', email: '' }));
      alert('Member invited successfully!');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/team/roles', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ name: newRoleName }),
      });

      if (!res.ok) throw new Error('Failed to create role');

      const { role } = await res.json();
      setRoles(prev => [...prev, role]);
      setNewRoleName('');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="flex-between">
        <div>
          <h1 className="font-serif text-4xl font-black text-slate-900 tracking-tight">Organization Core</h1>
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
            <div className="card-minimal" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="px-8 py-6 border-b flex-between bg-white">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Current Personnel</h3>
                <Users style={{ width: '1rem', height: '1rem' }} />
              </div>
              
              <div className="divide-y">
                {loading ? (
                  <div className="p-20 text-center text-slate-400">
                    <Loader2 className="animate-spin" style={{ margin: '0 auto 1rem' }} />
                    <p className="text-xs font-black uppercase tracking-widest">Syncing Personnel...</p>
                  </div>
                ) : employees.length > 0 ? (
                  employees.map((emp) => (
                    <div key={emp.id} className="p-8 flex-between hover:bg-slate-50 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-900 text-white flex-center font-black" style={{ borderRadius: '4px' }}>
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 flex items-center gap-2">
                            {emp.name}
                            {emp.role?.name === 'Owner' && <BadgeCheck style={{ width: '1rem', height: '1rem', color: 'var(--primary)' }} />}
                          </h4>
                          <p className="text-xs text-slate-400 font-bold tracking-tight">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-10">
                        <div className="text-right">
                          <div className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">
                            {emp.role?.name}
                          </div>
                          <p className="text-xs font-bold text-slate-400 flex items-center justify-end gap-1 uppercase">
                            <MapPin style={{ width: '0.8rem', height: '0.8rem' }} /> {emp.branch?.name || 'HQ'}
                          </p>
                        </div>
                        <button className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                          <Trash2 style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center text-slate-400">
                    No records found.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card-minimal" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="px-8 py-6 border-b flex-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Organization Positions</h3>
                <Briefcase style={{ width: '1rem', height: '1rem' }} />
              </div>
              <div className="divide-y">
                {roles.map(r => (
                  <div key={r.id} className="p-8 flex-between hover:bg-slate-50">
                    <div className="flex-col gap-1">
                      <h4 className="font-black text-slate-900 uppercase tracking-tight">{r.name}</h4>
                      <p className="text-xs text-slate-400 font-bold">Scoped to {r.tenantId ? 'Organization' : 'System'}</p>
                    </div>
                    {r.tenantId && (
                      <button className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                        <Trash2 style={{ width: '1rem', height: '1rem' }} />
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Add Role Inline */}
                <form onSubmit={handleAddRole} className="p-8 flex gap-4 bg-slate-50">
                  <input 
                    placeholder="New Position Title (e.g. Head Sommelier)"
                    className="input-minimal flex-1"
                    value={newRoleName}
                    style={{ background: 'white' }}
                    onChange={e => setNewRoleName(e.target.value)}
                  />
                  <button className="btn-minimal btn-accent" type="submit" disabled={submitting}>
                    <Plus style={{ width: '1rem', height: '1rem' }} /> Create
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="flex-col gap-6">
          <div className="card-minimal p-8">
            <h3 className="text-xl font-serif font-black mb-6">Invite Personnel</h3>
            <form onSubmit={handleAddMember} className="flex-col gap-4">
              <input 
                required
                placeholder="Full Name"
                className="input-minimal"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <input 
                required
                type="email" 
                placeholder="Email Address"
                className="input-minimal"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <select 
                  value={formData.roleName}
                  onChange={e => setFormData(prev => ({ ...prev, roleName: e.target.value }))}
                  className="input-minimal"
                >
                  <option disabled>Position</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.name} className="text-main">{r.name}</option>
                  ))}
                </select>
                <select 
                  required
                  value={formData.branchId}
                  onChange={e => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
                  className="input-minimal"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id} className="text-main">{b.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="btn-minimal btn-accent w-full"
              >
                {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Send Invitation'}
              </button>
            </form>
          </div>
          
          <div className="p-8 border-main rounded-sm bg-surface">
            <h4 className="text-xs font-black uppercase text-muted tracking-widest mb-4">Organization Capacity</h4>
            <div className="flex-col gap-4">
              <div className="flex-between">
                <span className="text-xs font-bold text-muted">Personnel Seats</span>
                <span className="text-xs font-black">{employees.length} / 15</span>
              </div>
              <div className="progress-bg">
                <div className="progress-bar" style={{ width: `${(employees.length / 15) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Local Utility (Better moved to global, but keeping here for now to avoid cross-file risk)
const styles = `
  .progress-bg { height: 4px; background: var(--border-main); border-radius: 2px; overflow: hidden; }
  .progress-bar { height: 100%; background: var(--primary); transition: width 0.3s; }
`;
