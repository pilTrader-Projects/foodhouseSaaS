'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ROLES } from '@/lib/constants';

interface Role { id: string; name: string }
interface Branch { id: string; name: string }

interface InviteFormProps {
  roles: Role[];
  branches: Branch[];
  tenantId: string;
  onSuccess: (user: any) => void;
}

export function InviteForm({ roles, branches, tenantId, onSuccess }: InviteFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleName: roles[0]?.name || ROLES.STAFF,
    branchId: branches[0]?.id || '',
  });

  // Backfill branchId once branches load asynchronously from the parent
  useEffect(() => {
    if (branches.length > 0 && !formData.branchId) {
      setFormData(prev => ({ ...prev, branchId: branches[0].id }));
    }
  }, [branches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      onSuccess(user);
      setFormData(prev => ({ ...prev, name: '', email: '' }));
      alert(`Invitation sent to ${user.email}!\n\nTemporary Login Credentials:\nEmail: ${user.email}\nPassword: change-me-later`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-minimal p-8">
      <h3 className="text-xl font-serif font-black mb-6 text-slate-900">Invite Personnel</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {roles.map(r => (
              <option key={r.id} value={r.name}>{r.name}</option>
            ))}
          </select>
          <select 
            required
            value={formData.branchId}
            onChange={e => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
            className="input-minimal"
          >
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="btn-minimal btn-accent w-full"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Send Invitation'}
        </button>
      </form>
    </div>
  );
}
