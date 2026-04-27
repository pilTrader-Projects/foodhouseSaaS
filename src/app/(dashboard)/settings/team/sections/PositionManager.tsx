'use client';

import React, { useState } from 'react';
import { Briefcase, Trash2, Plus, Loader2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  tenantId: string | null;
}

interface PositionManagerProps {
  roles: Role[];
  userId: string;
  onRoleCreated: (role: Role) => void;
}

export function PositionManager({ roles, userId, onRoleCreated }: PositionManagerProps) {
  const [submitting, setSubmitting] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

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
      onRoleCreated(role);
      setNewRoleName('');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-minimal" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="px-8 py-6 border-b flex justify-between items-center bg-white">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Organization Positions</h3>
        <Briefcase className="w-4 h-4" />
      </div>
      <div className="divide-y">
        {roles.map(r => (
          <div key={r.id} className="p-8 flex justify-between items-center hover:bg-slate-50 transition-all">
            <div>
              <h4 className="font-black text-slate-900 uppercase tracking-tight">{r.name}</h4>
              <p className="text-xs text-slate-400 font-bold">Scoped to {r.tenantId ? 'Organization' : 'System'}</p>
            </div>
            {r.tenantId && (
              <button aria-label="trash" className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        <form onSubmit={handleAddRole} className="p-8 flex gap-4 bg-slate-50">
          <input 
            placeholder="New Position Title (e.g. Head Sommelier)"
            className="input-minimal flex-1"
            value={newRoleName}
            style={{ background: 'white' }}
            onChange={e => setNewRoleName(e.target.value)}
          />
          <button className="btn-minimal btn-accent flex items-center gap-2" type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />} Create
          </button>
        </form>
      </div>
    </div>
  );
}
