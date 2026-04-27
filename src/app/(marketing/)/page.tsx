'use client';

import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  BarChart3, 
  ShoppingCart, 
  ChefHat, 
  Package,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 animate-fade-in" style={{ overflowX: 'hidden' }}>
      {/* Navigation */}
      <nav className="max-w-7xl px-6 py-8 flex-between border-b">
        <div className="flex-center gap-3">
          <div className="p-2 bg-black rounded-sm text-white">
            <ShieldCheck style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <h1 className="text-xl font-black tracking-tight uppercase">FoodHouse</h1>
        </div>
        
        <div className="md:flex items-center gap-10">
          <a href="#features" className="text-xs font-bold text-slate-500 hover-black uppercase tracking-widest">Features</a>
          <a href="#pricing" className="text-xs font-bold text-slate-500 hover-black uppercase tracking-widest">Pricing</a>
          <Link href="/login" className="text-xs font-bold text-slate-500 hover-black flex-center gap-2 uppercase tracking-widest" style={{ textDecoration: 'none' }}>
            <Lock style={{ width: '0.8rem', height: '0.8rem' }} /> Login
          </Link>
          <Link 
            href="/onboarding" 
            className="btn-minimal btn-accent"
            style={{ textDecoration: 'none' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl px-6 pt-20 pb-20 grid grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="flex-col gap-6"
        >
          <div className="text-accent text-xs font-black uppercase tracking-widest">
            SaaS for Modern Gastronomy
          </div>
          
          <h1 className="font-serif font-black leading-tight tracking-tight text-slate-900" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Elevate Your <br />
            <span className="text-accent">Operation.</span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium leading-relaxed" style={{ maxWidth: '30rem' }}>
            The minimalist OS for multi-branch restaurants. <br />
            Precision POS, smart inventory, and real-time oversight.
          </p>
          
          <div className="flex gap-4 pt-6">
            <Link 
              href="/onboarding" 
              className="btn-minimal btn-accent px-10"
              style={{ textDecoration: 'none' }}
            >
              Start Free <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </Link>
            <Link 
              href="/dashboard"
              className="btn-minimal btn-outline px-10"
              style={{ textDecoration: 'none' }}
            >
              Live Demo
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative md:flex flex-center"
        >
          <div className="bg-black p-1 shadow-minimal" style={{ borderRadius: '4px' }}>
             <div className="bg-white p-10 flex-col gap-6" style={{ width: '400px', borderRadius: '2px' }}>
                <div className="flex-between border-b pb-4">
                   <div className="flex-col gap-1">
                      <div style={{ height: '4px', width: '2rem', background: 'var(--primary)' }} />
                      <div className="text-xs font-black uppercase tracking-widest">Dashboard</div>
                   </div>
                   <div style={{ width: '1rem', height: '1rem', background: 'var(--border-light)', borderRadius: '50%' }} />
                </div>
                <div className="flex-col gap-4">
                   <div style={{ height: '2rem', width: '60%', background: 'var(--accent-dark)' }} />
                   <div className="grid grid-cols-2 gap-4">
                      <div style={{ height: '4rem', border: '1px solid var(--border-light)' }} />
                      <div style={{ height: '4rem', border: '1px solid var(--border-light)' }} />
                   </div>
                </div>
             </div>
          </div>

          <div className="absolute bg-white p-4 border shadow-minimal flex items-center gap-4" style={{ top: '2rem', left: '-2rem', borderRadius: '4px' }}>
            <div className="p-2 bg-accent text-white">
              <CheckCircle2 style={{ width: '1rem', height: '1rem' }} />
            </div>
            <div style={{ paddingRight: '1rem' }}>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">System Ready</p>
              <p className="text-sm font-black">99.9% Uptime</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-20" style={{ borderTop: '1px solid var(--border-light)' }}>
        <div className="max-w-7xl px-6">
          <div className="flex-col items-center gap-4 mb-20 text-center">
            <h2 className="font-serif text-4xl font-black text-slate-900 tracking-tight">The Modern Standard</h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Efficiency through minimalism.</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { title: 'POS Terminal', desc: 'Lightning fast and invisible checkout.', icon: ShoppingCart },
              { title: 'Smart Inventory', desc: 'Automated tracking with zero noise.', icon: Package },
              { title: 'Kitchen Display', desc: 'Precise coordination for busy lines.', icon: ChefHat },
              { title: 'Executive Insights', desc: 'The data you need, nothing else.', icon: BarChart3 }
            ].map((f, i) => (
              <div key={i} className="card-minimal" style={{ padding: '2rem' }}>
                <div className="mb-6 text-accent">
                  <f.icon style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-3">{f.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl px-6 py-10 text-center border-t">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">&copy; 2026 FoodHouse SaaS &bull; Modern Minimalist</p>
      </footer>

      <style jsx>{`
        .hover-black:hover { color: var(--text-primary); }
      `}</style>
    </div>
  );
}
