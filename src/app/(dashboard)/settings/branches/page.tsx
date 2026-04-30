'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Loader2, Building2, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RBACGate } from '@/components/auth/rbac-gate';
import { useUser } from '@/context/user-context';
import { BranchList } from './sections/BranchList';
import { AddBranchModal } from './sections/AddBranchModal';

export default function BranchesSettingsPage() {
  return (
    <RBACGate permission="manage:organization" redirectOnFail="/dashboard">
      <BranchesContent />
    </RBACGate>
  );
}

function BranchesContent() {
  const { user } = useUser();
  const [branches, setBranches] = useState<any[]>([]);
  const [limits, setLimits] = useState({ max_branches: 1 });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || '' : '';

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/branches', {
        headers: { 'x-tenant-id': tenantId }
      });
      const data = await res.json();
      setBranches(data.branches || []);
      if (data.limits) setLimits(data.limits);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) fetchBranches();
  }, [tenantId]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl font-black text-slate-900 tracking-tight">Outlets & Branches</h1>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest mt-2">Manage your physical locations and service points</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95"
        >
          <Plus size={14} />
          Add New Branch
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <BranchList branches={branches} loading={loading} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="p-8 border border-slate-200 rounded-sm bg-white">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Network Status</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex-center">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase">{branches.length} Active Outlets</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Operating normally</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Branch Limit</span>
                  <span className="text-xs font-black">{branches.length} / {limits.max_branches}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(branches.length / limits.max_branches) * 100}%` }}
                    className="h-full bg-slate-900" 
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 leading-relaxed">
                  You are using {branches.length} of your {limits.max_branches} available slots. <span className="text-primary cursor-pointer hover:underline">Upgrade plan</span> for more.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-900 text-white rounded-sm overflow-hidden relative">
             <Store className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
             <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Pro Tip</h4>
             <p className="text-sm font-medium text-slate-300 leading-relaxed">
               Each branch can have its own inventory and staff assignments. Switch branches from the sidebar to manage specific locations.
             </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <AddBranchModal 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={(newBranch) => {
              setBranches(prev => [...prev, newBranch]);
              setIsModalOpen(false);
            }}
            tenantId={tenantId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
