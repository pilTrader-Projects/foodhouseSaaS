'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './glass-card';

export function MockupDashboard() {
  return (
    <div className="relative w-full max-w-2xl aspect-[16/10] perspective-1000">
      <motion.div
        initial={{ rotateY: 5, rotateX: 5, opacity: 0, y: 20 }}
        animate={{ rotateY: -10, rotateX: 10, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-full relative"
      >
        {/* Main Dashboard Frame */}
        <GlassCard 
          intensity="high"
          className="w-full h-full p-6 border border-white/20 shadow-2xl flex flex-col gap-6 overflow-hidden"
          style={{ backgroundColor: 'rgba(30, 41, 59, 0.3)' }}
        >
          {/* Header Mockup */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center border border-primary/40">
                <div className="w-4 h-4 bg-primary rounded-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-2 w-24 bg-white/20 rounded-full" />
                <div className="h-1.5 w-16 bg-white/10 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10" />
              <div className="w-6 h-6 rounded-full bg-white/10" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-white/10 border border-white/10 flex flex-col gap-2">
                <div className="h-1.5 w-12 bg-white/20 rounded-full" />
                <div className="h-4 w-20 bg-white/30 rounded-full" />
                <div className="h-8 w-full mt-2 bg-gradient-to-t from-primary/20 to-transparent rounded-lg border-b border-primary/30" />
              </div>
            ))}
          </div>

          {/* Table/List Mockup */}
          <div className="flex-1 flex flex-col gap-3">
             <div className="h-2 w-32 bg-white/20 rounded-full mb-2" />
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/10 border border-white/10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-white/10" />
                   <div className="flex flex-col gap-1.5">
                     <div className="h-2 w-32 bg-white/20 rounded-full" />
                     <div className="h-1.5 w-20 bg-white/10 rounded-full" />
                   </div>
                 </div>
                 <div className="h-2 w-12 bg-primary/40 rounded-full" />
               </div>
             ))}
          </div>
        </GlassCard>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10"
        >
          <GlassCard className="p-4 shadow-accent">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 text-success rounded-lg">
                <div className="w-4 h-4 rounded-full border-2 border-success border-t-transparent animate-spin" />
              </div>
              <div className="pr-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Real-time</p>
                <p className="text-xs font-bold">Orders Processing</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-6 -left-10"
        >
          <GlassCard className="p-4 shadow-glow border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 text-primary rounded-lg font-black text-xs">
                +12%
              </div>
              <div className="pr-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Analytics</p>
                <p className="text-xs font-bold">Revenue Growth</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[120px] -z-10" />
    </div>
  );
}
