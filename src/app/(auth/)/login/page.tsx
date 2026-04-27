'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  ChevronLeft
} from 'lucide-react';

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
        <div className="min-h-screen bg-app flex-col flex-center p-4 animate-fade-in text-main">
            <Link 
                href="/" 
                className="text-xs font-black text-muted uppercase tracking-widest flex items-center gap-2 hover-main absolute-tl"
            >
                <ChevronLeft className="w-4 h-4" /> Back
            </Link>

            <div className="max-w-md w-full flex-col gap-10">
                <div className="flex-col items-center text-center gap-4">
                    <div className="p-4 bg-black text-white rounded-xs">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-4xl text-main">Access Dashboard</h1>
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mt-2">Precision management starts here</p>
                    </div>
                </div>

                <div className="card-minimal p-10">
                    {error && (
                        <div className="text-rose-600 mb-6 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1 h-1 bg-rose-600 rounded-full" />
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
                                className="input-minimal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="flex-col gap-2">
                            <div className="flex-between ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-muted">Password</label>
                                <a href="#" className="text-xs font-black uppercase tracking-widest text-accent">Reset</a>
                            </div>
                            <input 
                                type="password" 
                                required
                                placeholder="••••••••"
                                className="input-minimal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button 
                            disabled={isLoading}
                            type="submit"
                            className="btn-minimal btn-accent w-full"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-muted">
                        New Organization? {' '}
                        <Link href="/onboarding" className="text-accent">Create Account</Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
                .absolute-tl { position: absolute; top: 2.5rem; left: 2.5rem; }
                .rounded-xs { border-radius: 4px; }
                .hover-main:hover { color: var(--text-main); }
                .bg-black { background-color: #020617; }
            `}</style>
        </div>
    );
}
