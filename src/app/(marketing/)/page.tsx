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
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ overflowX: 'hidden' }}>
      {/* Navigation */}
      <nav className="max-w-7xl px-6 py-8 flex-between">
        <div className="flex-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-blue">
            <ShieldCheck style={{ width: '2rem', height: '2rem' }} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">FoodHouse SaaS</h1>
        </div>
        
        <div className="md:flex items-center gap-10">
          <a href="#features" className="text-sm font-bold text-slate-500 hover-nav">Features</a>
          <a href="#pricing" className="text-sm font-bold text-slate-500 hover-nav">Pricing</a>
          <Link href="/login" className="text-sm font-bold text-slate-500 hover-nav flex-center gap-2" style={{ textDecoration: 'none' }}>
            <Lock style={{ width: '1rem', height: '1rem' }} /> Login
          </Link>
          <Link 
            href="/onboarding" 
            className="bg-slate-900 text-white py-3 px-6 rounded-xl text-sm font-black shadow-premium"
            style={{ textDecoration: 'none' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl px-6 pt-20 pb-32 grid grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="flex-col gap-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl text-blue-600 font-black uppercase tracking-widest" style={{ fontSize: '0.65rem', width: 'fit-content' }}>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ display: 'inline-block' }} />
            Empowering Modern Food Business
          </div>
          
          <h1 className="font-black leading-tight tracking-tight text-slate-900" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            Scale Your <span className="text-blue-600">Flavor</span> Across Branches.
          </h1>
          
          <p className="text-xl text-slate-500 font-medium leading-relaxed" style={{ maxWidth: '32rem' }}>
            The all-in-one OS for multi-branch restaurants. From POS to smart inventory and executive insights.
          </p>
          
          <div className="flex gap-4 pt-4">
            <Link 
              href="/onboarding" 
              className="btn-premium btn-primary px-10 py-5 rounded-2xl shadow-blue"
              style={{ textDecoration: 'none' }}
            >
              Start Free Trial <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </Link>
            <Link 
              href="/dashboard"
              className="btn-premium bg-white text-slate-600 border-slate-100 rounded-2xl"
              style={{ border: '2px solid var(--slate-100)', textDecoration: 'none' }}
            >
              Live Demo
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-10" style={{ borderTop: '1px solid var(--slate-200)' }}>
            <div className="flex" style={{ marginLeft: '1rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-full bg-slate-200 flex-center text-white font-bold shadow-sm" 
                     style={{ width: '3rem', height: '3rem', border: '4px solid white', marginLeft: '-1rem' }}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Trusted by 500+ Branches</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative md:flex"
        >
          <div className="bg-white p-4 shadow-premium rounded-card-premium" style={{ border: '8px solid rgba(15,23,42,0.05)', transform: 'rotate(3deg)' }}>
            <div className="bg-slate-900 p-10 text-white flex-col gap-6" style={{ borderRadius: '2rem' }}>
              <div className="flex-between">
                <BarChart3 style={{ width: '2rem', height: '2rem', color: '#60a5fa' }} />
                <div style={{ width: '3rem', height: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem' }} />
              </div>
              <div className="flex-col gap-2">
                <div style={{ height: '0.5rem', width: '10rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem' }} />
                <div style={{ height: '2rem', width: '8rem', background: 'white', borderRadius: '1rem' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div style={{ height: '5rem', background: '#2563eb', borderRadius: '1.5rem' }} />
                <div style={{ height: '5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5rem' }} />
              </div>
            </div>
          </div>
          
          <div className="absolute bg-white p-4 rounded-2xl shadow-premium flex items-center gap-4 animate-bounce" style={{ top: '-2rem', left: '-2rem' }}>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 style={{ width: '1.5rem', height: '1.5rem' }} />
            </div>
            <div style={{ paddingRight: '1rem' }}>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Daily Revenue</p>
              <p className="text-xl font-black text-slate-900">₱42,500.00</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section id="features" className="bg-white py-32">
        <div className="max-w-7xl px-6">
          <div className="flex-col items-center gap-4 mb-20 text-center" style={{ margin: '0 auto 5rem' }}>
            <h2 className="text-xs font-black uppercase tracking-widest text-blue-600">The Infrastructure</h2>
            <h3 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '3rem' }}>Everything you need to grow.</h3>
            <p className="text-lg text-slate-500 font-medium max-w-3xl">Built for scale, designed for simplicity. FoodHouse powers your operations so you can focus on the flavor.</p>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {[
              { title: 'POS Terminal', desc: 'Lightning fast checkout for any device.', icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
              { title: 'Smart Inventory', desc: 'Real-time tracking & automated alerts.', icon: Package, color: 'bg-rose-50 text-rose-600' },
              { title: 'Kitchen Display', desc: 'Coordinate orders across prep stations.', icon: ChefHat, color: 'bg-emerald-50 text-emerald-600' },
              { title: 'Global Insights', desc: 'Compare branch performance anywhere.', icon: BarChart3, color: 'bg-blue-50 text-blue-600' }
            ].map((f, i) => (
              <div key={i} className="card-premium" style={{ transition: 'all 0.3s', padding: '2rem' }}>
                <div className={`p-4 rounded-xl flex-center mb-6 ${f.color}`} style={{ width: '4rem', height: '4rem' }}>
                  <f.icon style={{ width: '2rem', height: '2rem' }} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3">{f.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl px-6 py-20 text-center" style={{ borderTop: '1px solid var(--slate-100)', marginTop: '5rem' }}>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">&copy; 2026 FoodHouse SaaS &bull; Built for scale</p>
      </footer>

      <style jsx>{`
        .hover-nav:hover { color: var(--slate-900); }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce { animation: bounce 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
