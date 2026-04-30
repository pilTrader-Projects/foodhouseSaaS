'use client';

import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  BarChart3, 
  ShoppingCart, 
  ChefHat, 
  Package,
  Lock,
  Moon,
  Sun
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/context/theme-context';
import { MeshGradient } from '@/components/ui/mesh-gradient';
import { GlassCard } from '@/components/ui/glass-card';
import { MockupDashboard } from '@/components/ui/mockup-dashboard';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-app text-main relative overflow-x-hidden">
      <MeshGradient />

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-52 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            SaaS for Modern Gastronomy
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl lg:text-8xl font-serif font-black leading-[0.9] tracking-tighter">
            See Every Branch. <br />
            <span className="text-gradient">Control Every Detail.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-muted font-medium leading-relaxed max-w-xl">
            Real-time sales, inventory, and staff activity across all your locations — built for growing food businesses that can’t afford blind spots.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col gap-4 pt-4">
            <div className="flex flex-wrap gap-4">
              <Link href="/onboarding" className="btn-minimal bg-primary text-white hover:shadow-glow px-10 rounded-full h-14 text-sm group">
                Start Free ✅ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dashboard" className="btn-minimal border border-white/10 hover:bg-white/5 px-10 rounded-full h-14 text-sm">
                See It In Action
              </Link>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted pl-4">
              From chicken houses to cake shops — stay in control as you scale.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
             <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 opacity-70">
               Designed for growing food chains scaling from 2 to 20+ branches
             </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex justify-center"
        >
          <MockupDashboard />
        </motion.div>
      </header>

      {/* Stronger Positioning Line */}
      <section className="py-32 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl lg:text-3xl font-serif tracking-tight"
          >
            Built for owners managing multiple branches — <span className="text-primary italic">not just one counter.</span>
          </motion.p>
        </div>
      </section>

      {/* Problem -> Solution Section */}
      <section className="py-48 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <h2 className="text-5xl lg:text-6xl font-serif leading-[1.1] tracking-tighter">
              Running multiple branches shouldn’t mean <span className="text-primary">guessing</span> what’s happening.
            </h2>
            <div className="space-y-6">
              <p className="text-xl text-muted leading-relaxed">
                One branch runs out of stock. Another reports late. Numbers don’t match.
                By the time you notice, the damage is already done.
              </p>
              <p className="text-xl font-medium">
                FoodHouse gives you a live view of your entire operation — so you can act before problems grow.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <GlassCard className="p-1 aspect-square md:aspect-video flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-glow/20 animate-pulse flex items-center justify-center text-primary/40 font-serif italic">
                 Live Operations Feed
               </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="py-48 bg-primary/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 mb-20 text-center"
          >
            <h2 className="text-5xl lg:text-6xl tracking-tight font-serif">Stay in control — even when you’re not there.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Real-time Sales', desc: 'Track sales across all branches as they happen.', icon: BarChart3 },
              { title: 'Inventory Oversight', desc: 'Monitor inventory movement per location instantly.', icon: Package },
              { title: 'Performance Metrics', desc: 'Compare branch performance with one tap.', icon: ShieldCheck },
              { title: 'Risk Detection', desc: 'Spot issues before they affect your revenue.', icon: ArrowRight }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-glow">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-48 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 mb-24 text-center"
          >
            <h2 className="text-5xl lg:text-6xl tracking-tight font-serif">The Multi-Branch Standard</h2>
            <p className="text-xs text-primary font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="h-px w-8 bg-primary/30" />
              Built for operations, not just counters
              <span className="h-px w-8 bg-primary/30" />
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'POS Terminal', desc: 'Fast, reliable checkout built for high-volume food service — no delays during peak hours.', icon: ShoppingCart, color: 'primary' },
              { title: 'Smart Inventory', desc: 'See stock levels per branch in real time. Know what’s coming in and running out.', icon: Package, color: 'accent-glow' },
              { title: 'Kitchen Display', desc: 'Keep orders moving clearly from cashier to kitchen — reducing mistakes and delays.', icon: ChefHat, color: 'success' },
              { title: 'Multi-Branch Overview', desc: 'Get a live snapshot of every branch — sales, inventory, and activity — all in one place.', icon: BarChart3, color: 'primary' }
            ].map((f, i) => (
              <GlassCard 
                key={i} 
                className="p-8 group hover:border-primary/30 transition-all hover:-translate-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`mb-8 p-3 rounded-2xl bg-${f.color}/10 text-primary w-fit group-hover:scale-110 transition-transform shadow-sm`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-4">{f.title}</h4>
                <p className="text-sm text-muted font-medium leading-relaxed">{f.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight className="w-3 h-3" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Feature Section */}
      <section className="py-48 relative border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-widest mb-8"
          >
            Coming Soon
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-serif tracking-tight mb-8"
          >
            Built to integrate with your finances
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-muted leading-relaxed mb-12"
          >
            Export clean, structured data ready for accounting tools like
            QuickBooks and Xero — no manual encoding, no messy spreadsheets.
          </motion.p>
          <div className="flex justify-center gap-12 opacity-50 grayscale">
            <div className="font-bold text-2xl tracking-tighter">QuickBooks</div>
            <div className="font-bold text-2xl tracking-tighter">Xero</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 grayscale opacity-50">
             <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
             </div>
             <h1 className="text-sm font-black tracking-tight uppercase">FoodHouse</h1>
          </div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">&copy; 2026 FoodHouse SaaS &bull; Built for multi-branch food businesses</p>
          <div className="flex gap-8">
             <a href="#" className="text-[10px] font-black text-muted hover:text-white uppercase tracking-widest transition-colors">Privacy</a>
             <a href="#" className="text-[10px] font-black text-muted hover:text-white uppercase tracking-widest transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .bg-app { background-color: var(--bg-app); }
        .text-main { color: var(--text-main); }
        .text-muted { color: var(--text-muted); }
        .text-primary { color: var(--primary); }
        .text-success { color: #10b981; }
        .text-gradient {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .shadow-glow { box-shadow: var(--shadow-glow); }
        .shadow-accent { box-shadow: var(--shadow-accent); }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}
