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
  Lock,
  Moon,
  Sun
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/theme-context';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-app text-main animate-fade-in" style={{ overflowX: 'hidden' }}>
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex-between border-b">
        <div className="flex-center gap-3">
          <div className="p-2 bg-black rounded-sm text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight uppercase">FoodHouse</h1>
        </div>
        
        <div className="md:flex items-center gap-10">
          <a href="#features" className="text-xs font-black text-muted hover-main uppercase tracking-widest">Features</a>
          <button 
            onClick={toggleTheme}
            className="p-2 text-muted hover-main bg-surface rounded-sm"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <Link href="/login" className="text-xs font-black text-muted hover-main flex-center gap-2 uppercase tracking-widest">
            <Lock className="w-3 h-3" /> Login
          </Link>
          <Link href="/onboarding" className="btn-minimal btn-accent">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="flex-col gap-6"
        >
          <div className="text-accent text-xs font-black uppercase tracking-widest">
            SaaS for Modern Gastronomy
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-serif font-black leading-tight tracking-tight">
            Elevate Your <br />
            <span className="text-accent">Operation.</span>
          </h1>
          
          <p className="text-lg text-muted font-medium leading-relaxed max-w-xl">
            The minimalist OS for multi-branch restaurants. <br />
            Precision POS, smart inventory, and real-time oversight.
          </p>
          
          <div className="flex gap-4 pt-6">
            <Link href="/onboarding" className="btn-minimal btn-accent px-10">
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-minimal btn-outline px-10">
              Live Demo
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative hidden md:flex flex-center"
        >
          <div className="bg-black p-1 shadow-lg rounded-sm">
             <div className="bg-app p-10 flex-col gap-6 w-96 rounded-xs">
                <div className="flex-between border-b pb-4">
                   <div className="flex-col gap-1">
                      <div className="h-1 w-8 bg-accent" />
                      <div className="text-xs font-black uppercase tracking-widest">Dashboard</div>
                   </div>
                   <div className="w-4 h-4 bg-surface rounded-full" />
                </div>
                <div className="flex-col gap-4">
                   <div className="h-8 w-3/4 bg-main opacity-10" />
                   <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 border rounded-xs" />
                      <div className="h-16 border rounded-xs" />
                   </div>
                </div>
             </div>
          </div>

          <div className="absolute bg-app p-4 border shadow-md flex items-center gap-4 -top-8 -left-8 rounded-sm">
            <div className="p-2 bg-accent text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="pr-4">
              <p className="text-xs font-black uppercase tracking-widest text-muted">System Ready</p>
              <p className="text-sm font-black">99.9% Uptime</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex-col items-center gap-4 mb-20 text-center">
            <h2 className="text-4xl">The Modern Standard</h2>
            <p className="text-sm text-muted font-bold uppercase tracking-widest">Efficiency through minimalism.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'POS Terminal', desc: 'Lightning fast and invisible checkout.', icon: ShoppingCart },
              { title: 'Smart Inventory', desc: 'Automated tracking with zero noise.', icon: Package },
              { title: 'Kitchen Display', desc: 'Precise coordination for busy lines.', icon: ChefHat },
              { title: 'Executive Insights', desc: 'The data you need, nothing else.', icon: BarChart3 }
            ].map((f, i) => (
              <div key={i} className="card-minimal p-8">
                <div className="mb-6 text-accent">
                  <f.icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-3">{f.title}</h4>
                <p className="text-sm text-muted font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10 text-center border-t mt-20">
        <p className="text-xs font-bold text-muted uppercase tracking-widest">&copy; 2026 FoodHouse SaaS &bull; Modern Minimalist</p>
      </footer>

      <style jsx>{`
        .hover-main:hover { color: var(--text-main); }
        .bg-app { background-color: var(--bg-app); }
        .bg-surface { background-color: var(--bg-surface); }
        .bg-black { background-color: #020617; } /* Constant for visual mock */
        .text-main { color: var(--text-main); }
        .text-muted { color: var(--text-muted); }
        .text-accent { color: var(--text-accent); }
        .border-b { border-bottom: 1px solid var(--border-main); }
        .border-t { border-top: 1px solid var(--border-main); }
        .rounded-xs { border-radius: 2px; }
      `}</style>
    </div>
  );
}
