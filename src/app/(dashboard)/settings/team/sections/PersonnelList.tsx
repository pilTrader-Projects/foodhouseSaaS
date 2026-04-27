'use client';

import React from 'react';
import { Users, Loader2, BadgeCheck, MapPin, Trash2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role?: { name: string };
  branch?: { name: string };
}

interface PersonnelListProps {
  employees: Employee[];
  loading: boolean;
}

export function PersonnelList({ employees, loading }: PersonnelListProps) {
  return (
    <div className="card-minimal" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="px-8 py-6 border-b flex justify-between items-center bg-white">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Current Personnel</h3>
        <Users className="w-4 h-4" />
      </div>
      
      <div className="divide-y">
        {loading ? (
          <div className="p-20 text-center text-slate-400">
            <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Syncing Personnel...</p>
          </div>
        ) : employees.length > 0 ? (
          employees.map((emp) => (
            <div key={emp.id} className="p-8 flex justify-between items-center hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black rounded-md">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 flex items-center gap-2">
                    {emp.name}
                    {emp.role?.name === 'Owner' && <BadgeCheck className="w-4 h-4 text-blue-500" />}
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
                    <MapPin className="w-3 h-3" /> {emp.branch?.name || 'HQ'}
                  </p>
                </div>
                <button className="p-2 text-slate-300 hover:text-rose-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center text-slate-400 text-xs font-black uppercase">
            No records found.
          </div>
        )}
      </div>
    </div>
  );
}
