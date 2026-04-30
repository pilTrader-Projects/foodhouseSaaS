'use client';

import { useState } from 'react';
import { X, Loader2, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddBranchModalProps {
  onClose: () => void;
  onSuccess: (branch: any) => void;
  tenantId: string;
}

export function AddBranchModal({ onClose, onSuccess, tenantId }: AddBranchModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId
        },
        body: JSON.stringify({ name })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create branch');
      }

      onSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white shadow-2xl rounded-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Expand Network</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Register a new physical outlet</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest block">Branch Identification</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Downtown Metro Hub"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-bold placeholder:text-slate-300 text-sm transition-all"
                required
              />
            </div>
          </div>

          <div className="p-6 bg-blue-50/50 rounded-sm border border-blue-100 flex gap-4">
             <div className="w-10 h-10 bg-white rounded-full flex-center shrink-0 shadow-sm">
                <AlertCircle className="w-5 h-5 text-blue-500" />
             </div>
             <p className="text-[11px] font-medium text-blue-700 leading-relaxed">
               New branches are initialized with default settings. You can configure specific inventory and pricing after creation.
             </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-tight rounded-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-slate-200 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-[2] px-6 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Provisioning...
                </>
              ) : (
                'Create Branch'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
