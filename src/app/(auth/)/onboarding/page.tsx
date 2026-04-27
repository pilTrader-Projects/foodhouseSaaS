'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  CheckCircle2,
  Loader2
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
        { id: 1, title: 'Account' },
        { id: 2, title: 'Business' },
        { id: 3, title: 'Outlet' }
    ];

    return (
        <div className="min-h-screen bg-app flex-col flex-center p-4 animate-fade-in text-main">
            <div className="max-w-xl w-full">
                {/* Progress Indicators */}
                <div className="flex gap-10 mb-20 border-b pb-4">
                    {steps.map((s) => (
                        <div 
                            key={s.id} 
                            className={`flex items-center gap-2 transition-all duration-500 ${step >= s.id ? 'opacity-100' : 'opacity-30'}`}
                        >
                            <span className="text-xs font-black uppercase tracking-widest">{s.title}</span>
                            {step === s.id && <div className="w-1 h-1 bg-accent rounded-full" />}
                        </div>
                    ))}
                </div>

                <div className="flex-col gap-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-col gap-8"
                            >
                                <div>
                                    <h2 className="text-5xl">Identity</h2>
                                    <p className="text-xs font-bold text-muted uppercase tracking-widest mt-4">Personal Owner Credentials</p>
                                </div>
                                
                                <div className="flex-col gap-4">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        placeholder="Full Name"
                                        className="input-minimal"
                                        value={formData.user.name}
                                        onChange={(e) => updateFormData('user', 'name', e.target.value)}
                                    />
                                    <input 
                                        type="email" 
                                        placeholder="Business Email"
                                        className="input-minimal"
                                        value={formData.user.email}
                                        onChange={(e) => updateFormData('user', 'email', e.target.value)}
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="Secure Password"
                                        className="input-minimal"
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
                                className="flex-col gap-8"
                            >
                                <div>
                                    <h2 className="text-5xl">Organization</h2>
                                    <p className="text-xs font-bold text-muted uppercase tracking-widest mt-4">Brand & Infrastructure Selection</p>
                                </div>
                                
                                <div className="flex-col gap-6">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        placeholder="Organization Name"
                                        className="input-minimal"
                                        value={formData.business.name}
                                        onChange={(e) => updateFormData('business', 'name', e.target.value)}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div 
                                            onClick={() => updateFormData('business', 'plan', 'basic')}
                                            className={`cursor-pointer p-8 border transition-all duration-300 ${formData.business.plan === 'basic' ? 'border-accent bg-surface' : 'bg-app border-main'}`}
                                        >
                                            <h3 className="text-xs font-black uppercase tracking-widest">Standard</h3>
                                            <p className="text-xs text-muted mt-2">Single branch context initialization.</p>
                                        </div>
                                        <div 
                                            onClick={() => updateFormData('business', 'plan', 'pro')}
                                            className={`cursor-pointer p-8 border transition-all duration-300 ${formData.business.plan === 'pro' ? 'border-accent bg-surface' : 'bg-app border-main'}`}
                                        >
                                            <h3 className="text-xs font-black uppercase tracking-widest">Scale</h3>
                                            <p className="text-xs text-muted mt-2">Multi-tenant management enabled.</p>
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
                                className="flex-col gap-8"
                            >
                                <div>
                                    <h2 className="text-5xl">Deployment</h2>
                                    <p className="text-xs font-bold text-muted uppercase tracking-widest mt-4">Primary Branch Configuration</p>
                                </div>
                                
                                <div className="flex-col gap-4">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        placeholder="Branch Name (e.g. Headquarters)"
                                        className="input-minimal"
                                        value={formData.branch.name}
                                        onChange={(e) => updateFormData('branch', 'name', e.target.value)}
                                    />
                                    <div className="p-10 border flex-col gap-4 items-center text-center">
                                        <div className="text-accent">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest">Automated Setup</h4>
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
                    <div className="flex gap-4 items-center mt-10">
                        <button 
                            disabled={isLoading}
                            onClick={nextStep}
                            className="btn-minimal btn-accent px-10"
                        >
                            {isLoading ? 'Finalizing...' : step === 3 ? 'Deploy SaaS' : 'Next Phase'}
                        </button>
                        {step > 1 && (
                            <button 
                                onClick={prevStep}
                                className="btn-minimal btn-outline px-6"
                            >
                                Back
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="text-rose-600 text-xs font-black uppercase tracking-widest mt-6">
                           Error: {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
