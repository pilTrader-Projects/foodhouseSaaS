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

import { useUser } from '@/context/user-context';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { refreshUser } = useUser();

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
                
                // Explicitly refresh the global user context before redirecting
                await refreshUser();
                
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
        <div className="min-h-screen bg-app flex-col flex-center p-4 animate-fade-in">

            <div className="max-w-md w-full flex-col gap-10">
                <div className="flex-col items-center text-center gap-4">
                    <div className="p-4 bg-primary text-white shadow-glow" style={{ borderRadius: '12px', width: 'fit-content' }}>
                        <ShieldCheck style={{ width: '1.5rem', height: '1.5rem' }} />
                    </div>
                    <div>
                      <h1 className="font-serif text-4xl font-black text-main tracking-tight">Access Dashboard</h1>
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mt-2">Precision management starts here</p>
                    </div>
                </div>

                <div className="glass-card p-8 border border-white/5 shadow-2xl">
                    {error && (
                        <div className="text-rose-500 mb-6 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="bg-rose-500" style={{ width: '4px', height: '4px' }} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex-col gap-6">
                        <div className="flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted ml-1">Email</label>
                            <input 
                                autoFocus
                                type="email" 
                                required
                                placeholder="name@organization.com"
                                className="input-minimal bg-white/5 border-white/10 text-main focus:border-primary/50 transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex-col gap-2">
                            <div className="flex-between ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-muted">Password</label>
                                <a href="#" className="text-xs font-black uppercase tracking-widest text-primary" style={{ textDecoration: 'none' }}>Reset</a>
                            </div>
                            <input 
                                type="password" 
                                required
                                placeholder="••••••••"
                                className="input-minimal bg-white/5 border-white/10 text-main focus:border-primary/50 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button 
                            disabled={isLoading}
                            type="submit"
                            className="btn-minimal bg-primary text-white hover:shadow-glow w-full h-12 rounded-full"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" style={{ width: '1rem', height: '1rem' }} />
                            ) : (
                                <span className="flex items-center justify-center gap-2">Sign In <ArrowRight style={{ width: '1rem', height: '1rem' }} /></span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-muted">
                        New Organization? {' '}
                        <Link href="/onboarding" className="text-primary hover:underline" style={{ textDecoration: 'none' }}>Create Account</Link>
                    </p>
                </div>
            </div>
            <style jsx>{`
              .hover-black:hover { color: var(--text-primary); }
            `}</style>
        </div>
    );
}
