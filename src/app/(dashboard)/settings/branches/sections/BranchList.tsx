'use client';

import { MapPin, MoreVertical, Loader2, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface BranchListProps {
  branches: any[];
  loading: boolean;
}

export function BranchList({ branches, loading }: BranchListProps) {
  if (loading) {
    return (
      <div className="h-64 flex-center border border-slate-100 bg-white/50 rounded-sm">
        <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-sm bg-slate-50/50">
        <MapPin className="w-12 h-12 text-slate-200 mb-4" />
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No Branches Found</h3>
        <p className="text-xs text-slate-400 mt-2">Start by adding your first outlet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {branches.map((branch, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          key={branch.id}
          className="group relative p-8 bg-white border border-slate-200 rounded-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex-center group-hover:bg-primary/5 transition-colors duration-500">
                <MapPin className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{branch.name}</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-[10px] font-black text-emerald-700 uppercase tracking-widest rounded-full">Active</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3" />
                    Global Distribution
                  </span>
                  <span>•</span>
                  <span>ID: {branch.id.slice(-8)}</span>
                </div>
              </div>
            </div>

            <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Stock Points</p>
                <p className="text-xs font-black text-slate-900">{branch._count?.stocks || 0} Items</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Active Staff</p>
                <p className="text-xs font-black text-slate-900">{branch._count?.users || 0} Personnel</p>
              </div>
            </div>
            
            <button className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline">
              View Analytics
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
