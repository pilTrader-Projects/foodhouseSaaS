'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('tenantId', data.tenantId);
                router.push('/dashboard');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (e) {
            setError("Connection error. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex-col items-center flex-center p-4">
            <Link 
                href="/" 
                className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover-nav"
                style={{ position: 'absolute', top: '2.5rem', left: '2.5rem', textDecoration: 'none' }}
            >
                <ChevronLeft style={{ width: '1rem', height: '1rem' }} /> Back to home
            </Link>

            <div className="max-w-md w-full flex-col gap-10">
                <div className="flex-col items-center text-center">
                    <div className="p-4 bg-blue-600 rounded-card-premium text-white shadow-blue mb-6" style={{ width: 'fit-content', margin: '0 auto' }}>
                        <ShieldCheck style={{ width: '2.5rem', height: '2.5rem' }} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 font-semibold mt-2">Access your branch dashboard</p>
                </div>

                <div className="card-premium relative" style={{ overflow: 'hidden' }}>
                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2">
                            <span className="bg-rose-600 rounded-full" style={{ width: '0.4rem', height: '0.4rem' }} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex-col gap-6">
                        <div className="flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: 'var(--slate-400)' }} />
                                <input 
                                    autoFocus
                                    type="email" 
                                    required
                                    placeholder="juan@foodhouse.ph"
                                    className="input-premium"
                                    style={{ paddingLeft: '3.5rem' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-col gap-2">
                            <div className="flex-between ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                                <a href="#" className="text-xs font-black uppercase tracking-widest text-blue-600" style={{ textDecoration: 'none' }}>Forgot?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: 'var(--slate-400)' }} />
                                <input 
                                    type="password" 
                                    required
                                    placeholder="••••••••"
                                    className="input-premium"
                                    style={{ paddingLeft: '3.5rem' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            type="submit"
                            className="btn-premium btn-secondary w-full"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" style={{ width: '1.5rem', height: '1.5rem' }} />
                            ) : (
                                <>Sign In <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} /></>
                            )}
                        </button>
                    </form>

                    <div style={{ position: 'absolute', top: 0, right: 0, marginRight: '-1.5rem', marginTop: '-1.5rem', width: '5rem', height: '5rem', background: '#eff6ff', borderRadius: '5rem', filter: 'blur(2rem)', zIndex: -1 }} />
                </div>

                <div className="text-center">
                    <p className="text-sm font-bold text-slate-400">
                        Don't have an account? {' '}
                        <Link href="/onboarding" className="text-blue-600" style={{ textDecoration: 'none' }}>Create Business</Link>
                    </p>
                </div>
            </div>
            <style jsx>{`
              .hover-nav:hover { color: var(--slate-900); }
            `}</style>
        </div>
    );
}
