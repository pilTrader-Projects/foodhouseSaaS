'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { UserAvatar } from '../ui/user-avatar';

interface UserProfileWidgetProps {
  user: {
    name: string;
    role: { name: string };
    branch?: { name: string };
  };
}

export function UserProfileWidget({ user }: UserProfileWidgetProps) {
  return (
    <div className="px-8 py-10">
      <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
        <div className="relative">
          <UserAvatar name={user.name} size="lg" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#070c1b] rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-white uppercase tracking-tight leading-none">{user.name}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{user.role.name}</span>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/5"
      >
         <MapPin className="w-3.5 h-3.5 text-primary" />
         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">{user.branch?.name || 'Grand HQ'}</span>
      </motion.div>
    </div>
  );
}
