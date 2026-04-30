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
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 50], ['rgba(0,0,0,0)', 'rgba(2, 6, 23, 0.8)']);
  const navBlur = useTransform(scrollY, [0, 50], ['blur(0px)', 'blur(16px)']);

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

      {/* Navigation */}
      <motion.nav 
        style={{ backgroundColor: navBg, backdropFilter: navBlur }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-primary to-accent-glow rounded-xl text-white shadow-glow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase font-sans">FoodHouse</h1>
          </div>
          
          <div className="flex items-center gap-10">
            <a href="#features" className="text-[11px] font-black text-muted hover:text-white uppercase tracking-[0.2em] transition-colors">Features</a>
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted hover:text-white bg-white/5 rounded-full transition-all hover:scale-110"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link href="/login" className="text-[10px] font-black text-muted hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors">
              <Lock className="w-3 h-3" /> Login
            </Link>
            <Link href="/onboarding" className="btn-minimal bg-white text-black hover:bg-white/90 transition-all rounded-full px-6">
              Get Started
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-40 pb-20 grid lg:grid-cols-2 gap-16 items-center">
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
            Elevate Your <br />
            <span className="text-gradient">Operation.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-muted font-medium leading-relaxed max-w-xl">
            The minimalist OS for multi-branch restaurants. <br />
            Precision POS, smart inventory, and real-time oversight.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
            <Link href="/onboarding" className="btn-minimal bg-primary text-white hover:shadow-glow px-10 rounded-full h-14 text-sm group">
              Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard" className="btn-minimal border border-white/10 hover:bg-white/5 px-10 rounded-full h-14 text-sm">
              Live Demo
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-10 mt-4 opacity-50 grayscale transition-all hover:grayscale-0">
             <div className="text-[10px] font-black uppercase tracking-widest">Trusted By</div>
             <div className="h-4 w-24 bg-white/10 rounded-full" />
             <div className="h-4 w-24 bg-white/10 rounded-full" />
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

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 mb-24 text-center"
          >
            <h2 className="text-5xl lg:text-6xl tracking-tight">The Modern Standard</h2>
            <p className="text-xs text-primary font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <span className="h-px w-8 bg-primary/30" />
              Efficiency through minimalism
              <span className="h-px w-8 bg-primary/30" />
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'POS Terminal', desc: 'Lightning fast and invisible checkout.', icon: ShoppingCart, color: 'primary' },
              { title: 'Smart Inventory', desc: 'Automated tracking with zero noise.', icon: Package, color: 'accent-glow' },
              { title: 'Kitchen Display', desc: 'Precise coordination for busy lines.', icon: ChefHat, color: 'success' },
              { title: 'Executive Insights', desc: 'The data you need, nothing else.', icon: BarChart3, color: 'primary' }
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

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 grayscale opacity-50">
             <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
             </div>
             <h1 className="text-sm font-black tracking-tight uppercase">FoodHouse</h1>
          </div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">&copy; 2026 FoodHouse SaaS &bull; Modern Minimalist Excellence</p>
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
