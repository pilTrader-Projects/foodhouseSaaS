import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * Badge Component
 */
export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'dark', size?: 'sm' | 'xs', className?: string }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-green-50 text-green-700 border-green-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    dark: 'bg-slate-900 text-white'
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    xs: 'px-2 py-0.5 text-[9px]'
  };

  return (
    <span className={`inline-flex items-center font-black uppercase tracking-wider rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

/**
 * Button Component
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled, 
  loading, 
  icon: Icon,
  className = '',
  size = 'md'
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'dark',
  onClick?: () => void,
  disabled?: boolean,
  loading?: boolean,
  icon?: any,
  className?: string,
  size?: 'md' | 'xs'
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20',
    secondary: 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/20',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
    outline: 'bg-transparent hover:bg-slate-50 text-slate-900 border-2 border-slate-900',
    dark: 'bg-slate-900 hover:bg-black text-white shadow-lg shadow-slate-900/20'
  };

  const height = size === 'xs' ? 'h-10' : 'h-12';

  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-6 ${height} rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {Icon && !loading && <Icon className="w-3.5 h-3.5" />}
      {loading && <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />}
      {children}
    </button>
  );
};

/**
 * Card Component
 */
export const Card = ({ children, title, subtitle, className = '' }: { children: React.ReactNode, title?: string, subtitle?: string, className?: string }) => (
  <div className={`bg-white rounded-[2rem] border-2 border-slate-100 p-8 shadow-sm ${className}`}>
    {(title || subtitle) && (
      <div className="mb-6">
        {title && <h3 className="text-xl font-black text-slate-900 uppercase">{title}</h3>}
        {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);
