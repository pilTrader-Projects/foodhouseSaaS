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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Link 
                href="/" 
                className="absolute top-10 left-10 text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-slate-900 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" /> Back to home
            </Link>

            <div className="max-w-md w-full space-y-10">
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-500/30 mb-6">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 font-semibold mt-2">Access your branch dashboard</p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 animate-shake">
                            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-10 font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    autoFocus
                                    type="email" 
                                    required
                                    placeholder="juan@foodhouse.ph"
                                    className="w-full bg-slate-50 border-none pl-12 pr-5 py-5 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-10 font-black uppercase tracking-widest text-slate-400">Password</label>
                                <a href="#" className="text-10 font-black uppercase tracking-widest text-blue-600 hover:underline">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="password" 
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border-none pl-12 pr-5 py-5 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-blue-50 rounded-full blur-2xl -z-10" />
                </div>

                <div className="text-center">
                    <p className="text-sm font-bold text-slate-400">
                        Don't have an account? {' '}
                        <Link href="/onboarding" className="text-blue-600 hover:underline">Create Business</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
