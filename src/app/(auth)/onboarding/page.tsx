'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/user-context';
import { AuthContainer } from '@/components/auth/auth-container';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const { refreshUser } = useUser();
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
                
                await refreshUser();
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
        { id: 1, title: 'Account' },
        { id: 2, title: 'Business' },
        { id: 3, title: 'Outlet' }
    ];

    const stepTitles = {
        1: { main: 'Identity', sub: 'Personal Owner Credentials' },
        2: { main: 'Organization', sub: 'Brand & Infrastructure Selection' },
        3: { main: 'Deployment', sub: 'Primary Branch Configuration' }
    };

    const { main, sub } = stepTitles[step as keyof typeof stepTitles];

    return (
        <AuthContainer 
            title={main} 
            subtitle={sub} 
            maxWidth="xl"
        >
            <div className="flex flex-col gap-10">
                {/* Progress Indicators */}
                <div className="flex gap-10 border-b border-white/5 pb-4">
                    {steps.map((s) => (
                        <div 
                            key={s.id} 
                            className={`flex items-center gap-2 transition-all duration-500 ${step >= s.id ? 'opacity-100' : 'opacity-30'}`}
                        >
                            <span className="text-xs font-black uppercase tracking-widest text-main">{s.title}</span>
                            {step === s.id && <div className="w-1 h-1 bg-primary rounded-full shadow-glow" />}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-8"
                            >
                                <div className="flex flex-col gap-4">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        placeholder="Full Name"
                                        className="input-minimal bg-white/5 border-white/10 text-main focus:border-primary/50 transition-colors"
                                        value={formData.user.name}
                                        onChange={(e) => updateFormData('user', 'name', e.target.value)}
                                    />
                                    <input 
                                        type="email" 
                                        placeholder="Business Email"
                                        className="input-minimal bg-white/5 border-white/10 text-main focus:border-primary/50 transition-colors"
                                        value={formData.user.email}
                                        onChange={(e) => updateFormData('user', 'email', e.target.value)}
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="Secure Password"
                                        className="input-minimal bg-white/5 border-white/10 text-main focus:border-primary/50 transition-colors"
                                        value={formData.user.password}
                                        onChange={(e) => updateFormData('user', 'password', e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col gap-8"
                            >
                                <div className="flex flex-col gap-6">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        placeholder="Organization Name"
                                        className="input-minimal bg-white/5 border-white/10 text-main focus:border-primary/50 transition-colors"
                                        value={formData.business.name}
                                        onChange={(e) => updateFormData('business', 'name', e.target.value)}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'basic', label: 'Standard', desc: 'Single branch context initialization.' },
                                            { id: 'pro', label: 'Scale', desc: 'Multi-tenant management enabled.' }
                                        ].map((plan) => (
                                            <div 
                                                key={plan.id}
                                                onClick={() => updateFormData('business', 'plan', plan.id)}
                                                className="cursor-pointer transition-all duration-300 relative flex flex-col"
                                                style={{ 
                                                    padding: '2rem',
                                                    borderRadius: '16px',
                                                    border: formData.business.plan === plan.id ? '3px solid var(--primary)' : '1px solid var(--glass-border)',
                                                    backgroundColor: formData.business.plan === plan.id ? 'var(--primary-glow)' : 'transparent',
                                                    boxShadow: formData.business.plan === plan.id ? 'var(--shadow-glow)' : 'none'
                                                }}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-main">{plan.label}</h3>
                                                    {formData.business.plan === plan.id && (
                                                        <div className="w-2 h-2 bg-primary rounded-full shadow-glow" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted leading-relaxed mb-4">{plan.desc}</p>
                                                
                                                {formData.business.plan === plan.id && (
                                                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mt-auto">
                                                        Selected
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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
                                className="flex flex-col gap-8"
                            >
                                <div className="flex flex-col gap-4">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        placeholder="Branch Name (e.g. Headquarters)"
                                        className="input-minimal bg-white/5 border-white/10 text-main focus:border-primary/50 transition-colors"
                                        value={formData.branch.name}
                                        onChange={(e) => updateFormData('branch', 'name', e.target.value)}
                                    />
                                    <div className="p-10 border border-white/5 bg-white/2 flex flex-col gap-4 items-center text-center rounded-2xl">
                                        <div className="text-primary">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-main">Automated Setup</h4>
                                            <p className="text-xs text-muted mt-2 leading-relaxed">
                                                The system will provision standard roles, inventory structures, and security protocols for your new branch.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex gap-4 items-center">
                        <button 
                            disabled={step === 1 || isLoading}
                            onClick={prevStep}
                            className={`btn-minimal border border-white/10 text-black px-8 h-12 rounded-full transition-opacity ${
                                step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5'
                            }`}
                        >
                            Back
                        </button>
                        
                        <button 
                            disabled={isLoading}
                            onClick={nextStep}
                            className="btn-minimal bg-primary text-black hover:shadow-glow px-10 h-12 rounded-full flex-1"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                                step === 3 ? 'Deploy SaaS' : 'Next Phase'
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="text-rose-500 text-xs font-black uppercase tracking-widest">
                           Error: {error}
                        </div>
                    )}
                </div>
            </div>
        </AuthContainer>
    );
}
