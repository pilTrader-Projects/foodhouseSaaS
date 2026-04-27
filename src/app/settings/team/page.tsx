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
  Trash2
} from 'lucide-react';

export default function TeamManagementPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tenant, setTenant] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleName: 'Cashier',
    branchId: '',
  });

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || 'tenant-demo' : 'tenant-demo';

  useEffect(() => {
    const savedTenant = localStorage.getItem('demo_tenant');
    if (savedTenant) setTenant(JSON.parse(savedTenant));

    async function init() {
      try {
        const [teamRes, branchRes] = await Promise.all([
          fetch('/api/team', { headers: { 'x-tenant-id': tenantId } }),
          fetch('/api/branches', { headers: { 'x-tenant-id': tenantId } }),
        ]);

        const teamData = await teamRes.json();
        const branchData = await branchRes.json();

        setEmployees(teamData.team || []);
        setBranches(branchData.branches || []);
        
        // Default to first branch if available
        if (branchData.branches?.length > 0) {
          setFormData(prev => ({ ...prev, branchId: branchData.branches[0].id }));
        }
      } catch (e) {
        console.error("Failed to load team data", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [tenantId]);

  const handleAdd = async (e: React.FormEvent) => {
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">Team Management</h1>
          <p className="text-slate-500 font-medium">Manage personnel and access control for your branches.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-amber-100">
            <Shield className="w-4 h-4" />
            Plan Limit: {employees.length} / 15 Users
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Employee List */}
        <div className="col-span-2 space-y-4">
          <div className="card bg-white p-0 overflow-hidden border-slate-200">
            <div className="px-6 py-4 border-bottom border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Current Personnel</h3>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-12 text-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-20" />
                  <p>Syncing team data...</p>
                </div>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <div key={emp.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 border border-white shadow-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          {emp.name}
                          {emp.role?.name === 'Owner' && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                        </h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                          <Mail className="w-3 h-3" /> {emp.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-10 font-black uppercase tracking-wider bg-slate-900 text-white mb-1">
                          {emp.role?.name}
                        </div>
                        <p className="text-10 font-bold text-slate-400 flex items-center justify-end gap-1 uppercase">
                          <MapPin className="w-3 h-3" /> {emp.branch?.name || 'All Branches'}
                        </p>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 font-medium">
                  No employees found. Invite your first staff member.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add User Form */}
        <div className="space-y-6">
          <div className="card bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold">Invite Member</h3>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-10 font-black uppercase text-slate-400 tracking-widest pl-1">Full Name</label>
                <input 
                  required
                  placeholder="e.g. Maria Clara"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:bg-white/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-10 font-black uppercase text-slate-400 tracking-widest pl-1">Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="maria@foodhouse.ph"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:bg-white/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-10 font-black uppercase text-slate-400 tracking-widest pl-1">Role</label>
                  <select 
                    value={formData.roleName}
                    onChange={e => setFormData(prev => ({ ...prev, roleName: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option className="text-slate-900">Cashier</option>
                    <option className="text-slate-900">Manager</option>
                    <option className="text-slate-900">Chef</option>
                    <option className="text-slate-900">Accountant</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-10 font-black uppercase text-slate-400 tracking-widest pl-1">Branch</label>
                  <select 
                    required
                    value={formData.branchId}
                    onChange={e => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:bg-white/10 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id} className="text-slate-900">{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Invitation'}
              </button>
            </form>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <h4 className="text-10 font-black uppercase text-slate-400 tracking-widest mb-3">Permissions Preview</h4>
            <div className="space-y-2">
              {formData.roleName === 'Cashier' && <p className="text-xs font-bold text-slate-600">• Access to POS Only</p>}
              {formData.roleName === 'Manager' && <p className="text-xs font-bold text-slate-600">• Inventory, POS Sales View, Receipts</p>}
              {formData.roleName === 'Chef' && <p className="text-xs font-bold text-slate-600">• Kitchen Display & Supply Management</p>}
              <p className="text-10 text-slate-400 mt-4 italic font-medium">Access is strictly scoped to the assigned branch.</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .card { @apply p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300; }
        .animate-in { animation: fadeIn 0.5s forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
