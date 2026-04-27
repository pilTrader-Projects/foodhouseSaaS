'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Store, 
  MapPin, 
  ArrowRight, 
  CheckCircle2,
  ChevronRight,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        user: { name: '', email: '', password: '' },
        business: { name: '', plan: 'basic' },
        branch: { name: 'Main Branch' }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const updateFormData = (section: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [field]: value
            }
        }));
    };

    const handleOnboarding = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('tenantId', data.tenantId);
                localStorage.setItem('userId', data.userId);
                router.push('/dashboard');
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (e) {
            console.error("Onboarding failed", e);
            setError("Connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (step < 3) setStep(step + 1);
        else handleOnboarding();
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const steps = [
        { id: 1, title: 'Account', icon: User, desc: 'Your owner profile' },
        { id: 2, title: 'Business', icon: Store, desc: 'Brand & Subscription' },
        { id: 3, title: 'Outlet', icon: MapPin, desc: 'Your first branch' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex-col items-center flex-center p-4">
            <div className="max-w-xl w-full">
                {/* Header / Logo */}
                <div className="flex-center gap-3 mb-10">
                    <div className="p-2 bg-blue-600 rounded-xl text-white shadow-blue">
                        <ShieldCheck style={{ width: '2rem', height: '2rem' }} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">FoodHouse SaaS</h1>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-4 mb-10" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {steps.map((s) => (
                        <div 
                            key={s.id} 
                            style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: '0.5rem', 
                              minWidth: '120px', 
                              opacity: step >= s.id ? 1 : 0.4,
                              transform: step === s.id ? 'scale(1)' : 'scale(0.95)',
                              transition: 'all 0.5s'
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <div style={{ 
                                  width: '2rem', 
                                  height: '2rem', 
                                  borderRadius: '50%', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  fontSize: '0.75rem', 
                                  fontWeight: 'bold',
                                  background: step > s.id ? '#10b981' : step === s.id ? '#2563eb' : '#e2e8f0',
                                  color: 'white',
                                  boxShadow: step === s.id ? '0 10px 20px rgba(37, 99, 235, 0.3)' : 'none'
                                }}>
                                    {step > s.id ? <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem' }} /> : s.id}
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest" style={{ color: step === s.id ? 'var(--slate-900)' : 'var(--slate-500)' }}>{s.title}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card-premium relative" style={{ overflow: 'hidden' }}>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3"
                            style={{ border: '1px solid #ffe4e6' }}
                        >
                            <div className="bg-rose-500 rounded-full animate-pulse" style={{ width: '0.4rem', height: '0.4rem' }} />
                            {error}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-col gap-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">Create Owner Account</h2>
                                    <p className="text-slate-500 font-medium">Let's get started with your personal details.</p>
                                </div>
                                
                                <div className="flex-col gap-4">
                                    <div className="flex-col gap-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="Juan Dela Cruz"
                                            className="input-premium"
                                            value={formData.user.name}
                                            onChange={(e) => updateFormData('user', 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-col gap-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="juan@foodhouse.ph"
                                            className="input-premium"
                                            value={formData.user.email}
                                            onChange={(e) => updateFormData('user', 'email', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-col gap-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            className="input-premium"
                                            value={formData.user.password}
                                            onChange={(e) => updateFormData('user', 'password', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-col gap-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">Business Identity</h2>
                                    <p className="text-slate-500 font-medium">Tell us about your organization.</p>
                                </div>
                                
                                <div className="flex-col gap-6">
                                    <div className="flex-col gap-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Business Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="e.g. Mario's Pizza"
                                            className="input-premium"
                                            value={formData.business.name}
                                            onChange={(e) => updateFormData('business', 'name', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div 
                                            onClick={() => updateFormData('business', 'plan', 'basic')}
                                            className="p-5 rounded-3xl border transition-all"
                                            style={{ 
                                              cursor: 'pointer',
                                              borderColor: formData.business.plan === 'basic' ? '#2563eb' : '#f1f5f9',
                                              background: formData.business.plan === 'basic' ? '#eff6ff' : 'white',
                                              borderWidth: '2px'
                                            }}
                                        >
                                            <div className="flex-center mb-3 rounded-full" style={{ width: '2rem', height: '2rem', background: formData.business.plan === 'basic' ? '#2563eb' : '#f1f5f9', color: formData.business.plan === 'basic' ? 'white' : '#94a3b8' }}>
                                                <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem' }} />
                                            </div>
                                            <h3 className="font-black text-slate-900">Basic</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase mt-1">1 Outlet Only</p>
                                        </div>
                                        <div 
                                            onClick={() => updateFormData('business', 'plan', 'pro')}
                                            className="p-5 rounded-3xl border transition-all"
                                            style={{ 
                                              cursor: 'pointer',
                                              borderColor: formData.business.plan === 'pro' ? '#2563eb' : '#f1f5f9',
                                              background: formData.business.plan === 'pro' ? '#eff6ff' : 'white',
                                              borderWidth: '2px'
                                            }}
                                        >
                                            <div className="flex-center mb-3 rounded-full" style={{ width: '2rem', height: '2rem', background: formData.business.plan === 'pro' ? '#2563eb' : '#f1f5f9', color: formData.business.plan === 'pro' ? 'white' : '#94a3b8' }}>
                                                <Store style={{ width: '1.25rem', height: '1.25rem' }} />
                                            </div>
                                            <h3 className="font-black text-slate-900">Pro</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase mt-1">Unlimited Outlets</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-col gap-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">First Outlet Setup</h2>
                                    <p className="text-slate-500 font-medium">Create your primary operational branch.</p>
                                </div>
                                
                                <div className="flex-col gap-4">
                                    <div className="flex-col gap-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Outlet / Branch Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="e.g. Greenhills Branch"
                                            className="input-premium"
                                            value={formData.branch.name}
                                            onChange={(e) => updateFormData('branch', 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-3xl flex gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm" style={{ height: 'fit-content' }}>
                                            <MapPin style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb' }} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-900">Live Context Initialization</h4>
                                            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                                                We'll set up standard roles and operational settings for this branch automatically.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex-between gap-4" style={{ marginTop: '3rem' }}>
                        {step > 1 ? (
                            <button 
                                onClick={prevStep}
                                className="text-xs font-black text-slate-400 uppercase tracking-widest hover-nav"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Back
                            </button>
                        ) : <div />}

                        <button 
                            disabled={isLoading}
                            onClick={nextStep}
                            className="btn-premium btn-primary"
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" style={{ width: '1.25rem', height: '1.25rem' }} /> Finalizing...</>
                            ) : (
                                <>
                                    {step === 3 ? 'Launch SaaS' : 'Continue'}
                                    <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                                </>
                            )}
                        </button>
                    </div>

                    <div style={{ position: 'absolute', bottom: '-2.5rem', right: '-2.5rem', width: '10rem', height: '10rem', background: '#eff6ff', borderRadius: '10rem', filter: 'blur(3rem)', zIndex: -1 }} />
                </div>

                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">
                    Step {step} of 3 &bull; Fully Managed AI Infrastructure
                </p>
            </div>
            <style jsx>{`
              .hover-nav:hover { color: var(--slate-900); }
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
