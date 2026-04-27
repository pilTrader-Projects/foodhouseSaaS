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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">FoodHouse SaaS</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Pricing</a>
          <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
            <Lock className="w-4 h-4" /> Login
          </Link>
          <Link 
            href="/onboarding" 
            className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-black hover:scale-105 transition-all shadow-xl shadow-slate-900/10"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-xs font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Empowering Modern Food Business
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight text-slate-900">
            Scale Your <span className="text-blue-600">Flavor</span> Across Branches.
          </h1>
          
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
            The all-in-one OS for multi-branch restaurants. From POS to smart inventory and executive insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/onboarding" 
              className="bg-blue-600 text-white px-10 py-5 rounded-2xl text-lg font-black hover:scale-105 transition-all shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/dashboard" // Quick access for demo purposes
              className="bg-white border-2 border-slate-100 text-slate-600 px-10 py-5 rounded-2xl text-lg font-black hover:bg-slate-50 transition-all flex items-center justify-center"
            >
              Live Demo
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-10 border-t border-slate-100">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-xs font-bold`}>
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trusted by 500+ Branches</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Mockup Dashboard Section */}
          <div className="bg-white rounded-[3rem] p-4 shadow-2xl shadow-blue-500/10 border-8 border-slate-900/5 rotate-3 hover:rotate-0 transition-transform duration-700 overflow-hidden">
            <div className="bg-slate-900 rounded-[2rem] p-10 text-white space-y-6">
              <div className="flex justify-between items-center">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                <div className="w-12 h-4 bg-white/10 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                <div className="h-8 w-1/2 bg-white rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-blue-600 rounded-3xl" />
                <div className="h-20 bg-white/5 rounded-3xl" />
              </div>
            </div>
          </div>
          {/* Floating Element */}
          <div className="absolute -top-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl shadow-slate-900/10 flex items-center gap-4 animate-bounce">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="pr-4">
              <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Daily Revenue</p>
              <p className="text-xl font-black text-slate-900">₱42,500.00</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Grid */}
      <section id="features" className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-blue-600">The Infrastructure</h2>
            <h3 className="text-5xl font-black text-slate-900 tracking-tight">Everything you need to grow.</h3>
            <p className="text-lg text-slate-500 font-medium">Built for scale, designed for simplicity. FoodHouse powers your operations so you can focus on the flavor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'POS Terminal', desc: 'Lightning fast checkout for any device.', icon: ShoppingCart, color: 'bg-indigo-50 text-indigo-600' },
              { title: 'Smart Inventory', desc: 'Real-time tracking & automated alerts.', icon: Package, color: 'bg-rose-50 text-rose-600' },
              { title: 'Kitchen Display', desc: 'Coordinate orders across prep stations.', icon: ChefHat, color: 'bg-amber-50 text-amber-600' },
              { title: 'Global Insights', desc: 'Compare branch performance anywhere.', icon: BarChart3, color: 'bg-blue-50 text-blue-600' }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${f.color}`}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3">{f.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100 mt-20 text-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">&copy; 2026 FoodHouse SaaS &bull; Built for scale</p>
      </footer>
    </div>
  );
}
