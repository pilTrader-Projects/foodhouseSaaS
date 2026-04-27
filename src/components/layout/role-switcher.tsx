'use client';

import { useState, useEffect } from 'react';
import { UserCircle, RefreshCcw } from 'lucide-react';

export function RoleSwitcher() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState(typeof window !== 'undefined' ? localStorage.getItem('userId') || 'user-admin' : 'user-admin');

  useEffect(() => {
    async function fetchUsers() {
      const tenantId = localStorage.getItem('tenantId') || 'tenant-demo';
      try {
        const res = await fetch('/api/team', { headers: { 'x-tenant-id': tenantId } });
        const data = await res.json();
        setUsers(data.team || []);
      } catch (e) {
        console.error("Failed to fetch users for switcher", e);
      }
    }
    fetchUsers();
  }, []);

  const handleSwitch = (userId: string) => {
    localStorage.setItem('userId', userId);
    setCurrentId(userId);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2">
        <UserCircle className="w-4 h-4 text-slate-400" />
        <span className="text-10 font-black uppercase text-slate-400 tracking-widest">Switch Role:</span>
      </div>
      <select 
        value={currentId}
        onChange={(e) => handleSwitch(e.target.value)}
        className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
      >
        <option value="user-admin">Owner (Master)</option>
        {users.filter(u => u.id !== 'user-admin').map(u => (
          <option key={u.id} value={u.id}>{u.name} ({u.role?.name})</option>
        ))}
      </select>
      <RefreshCcw className="w-3 h-3 text-slate-300" />
    </div>
  );
}
