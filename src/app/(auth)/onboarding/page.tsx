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
                router.push('/');
            } else {
                setError(data.error || 'Something went wrong');
                setStep(1); // Go back to start if it's a validation error usually
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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-xl w-full">
                {/* Header / Logo */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">FoodHouse SaaS</h1>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-2 px-2 scrollbar-hide">
                    {steps.map((s) => (
                        <div 
                            key={s.id} 
                            className={`flex flex-col gap-2 min-w-[120px] transition-all duration-500 ${step >= s.id ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step > s.id ? 'bg-emerald-500 text-white' : step === s.id ? 'bg-primary text-white shadow-lg shadow-blue-500/40' : 'bg-slate-200 text-slate-500'}`}>
                                    {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${step === s.id ? 'text-slate-900' : 'text-slate-500'}`}>{s.title}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card bg-white p-8 md:p-10 shadow-2xl shadow-slate-200/60 rounded-[2.5rem] border-none relative overflow-hidden">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3"
                        >
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
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
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">Create Owner Account</h2>
                                    <p className="text-slate-500 font-medium">Let's get started with your personal details.</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-10 font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="Juan Dela Cruz"
                                            className="w-full bg-slate-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none"
                                            value={formData.user.name}
                                            onChange={(e) => updateFormData('user', 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-10 font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="juan@foodhouse.ph"
                                            className="w-full bg-slate-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none"
                                            value={formData.user.email}
                                            onChange={(e) => updateFormData('user', 'email', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-10 font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none"
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
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">Business Identity</h2>
                                    <p className="text-slate-500 font-medium">Tell us about your organization.</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-10 font-black uppercase tracking-widest text-slate-400 ml-1">Business Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="e.g. Mario's Pizza"
                                            className="w-full bg-slate-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none"
                                            value={formData.business.name}
                                            onChange={(e) => updateFormData('business', 'name', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div 
                                            onClick={() => updateFormData('business', 'plan', 'basic')}
                                            className={`p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${formData.business.plan === 'basic' ? 'border-primary bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${formData.business.plan === 'basic' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-black text-slate-900">Basic</h3>
                                            <p className="text-10 font-bold text-slate-400 uppercase mt-1">1 Outlet Only</p>
                                        </div>
                                        <div 
                                            onClick={() => updateFormData('business', 'plan', 'pro')}
                                            className={`p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${formData.business.plan === 'pro' ? 'border-primary bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${formData.business.plan === 'pro' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                <Store className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-black text-slate-900">Pro</h3>
                                            <p className="text-10 font-bold text-slate-400 uppercase mt-1">Unlimited Outlets</p>
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
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">First Outlet Setup</h2>
                                    <p className="text-slate-500 font-medium">Create your primary operational branch.</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-10 font-black uppercase tracking-widest text-slate-400 ml-1">Outlet / Branch Name</label>
                                        <input 
                                            autoFocus
                                            type="text" 
                                            placeholder="e.g. Greenhills Branch"
                                            className="w-full bg-slate-50 border-none px-5 py-4 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none"
                                            value={formData.branch.name}
                                            onChange={(e) => updateFormData('branch', 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-[2rem] flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm">
                                            <MapPin className="w-6 h-6 text-primary" />
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
                    <div className="mt-12 flex items-center justify-between gap-4">
                        {step > 1 ? (
                            <button 
                                onClick={prevStep}
                                className="px-8 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                            >
                                Back
                            </button>
                        ) : <div />}

                        <button 
                            disabled={isLoading}
                            onClick={nextStep}
                            className="bg-primary text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/30 hover:scale-105 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> Finalizing...</>
                            ) : (
                                <>
                                    {step === 3 ? 'Launch SaaS' : 'Continue'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Background Accent */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10" />
                </div>

                <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Step {step} of 3 &bull; Fully Managed AI Infrastructure
                </p>
            </div>
        </div>
    );
}

<style jsx>{`
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>
