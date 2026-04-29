import React from 'react';
import './ui.css';

// Re-export components
export { Modal } from './modal';

/**
 * Badge Component
 */
export const Badge = ({ children, variant = 'default', size = 'sm', className = '', style }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'dark', size?: 'sm' | 'xs', className?: string, style?: React.CSSProperties }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    info: 'bg-sky-100 text-sky-700',
    dark: 'bg-slate-900 text-white'
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    xs: 'px-2 py-0.5 text-10'
  };

  return (
    <span className={`inline-flex items-center font-bold rounded-full uppercase tracking-widest ${variants[variant]} ${sizes[size]} ${className}`} style={style}>
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
  size = 'md',
  type = 'button',
  style
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'dark',
  onClick?: () => void,
  disabled?: boolean,
  loading?: boolean,
  icon?: any,
  className?: string,
  size?: 'md' | 'xs',
  type?: 'button' | 'submit' | 'reset',
  style?: React.CSSProperties
}) => {
  const variants = {
    primary: 'btn-primary text-white',
    secondary: 'btn-secondary',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    ghost: 'hover:bg-slate-100 text-slate-600', 
    outline: 'border-2 border-slate-200 hover:border-slate-900', 
    dark: 'bg-slate-900 text-white hover:bg-black'
  };

  const sizeClasses = size === 'xs' ? 'h-9 px-3 text-xs' : 'h-11 px-6 text-sm';

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn-premium ${variants[variant]} ${sizeClasses} ${className}`}
      style={style}
    >
      {Icon && !loading && <Icon className="w-4 h-4" />}
      {loading && <div className="ui-spinner" />}
      {children}
    </button>
  );
};

/**
 * Card Component
 */
export const Card = ({ children, title, subtitle, className = '', style }: { children: React.ReactNode, title?: string, subtitle?: string, className?: string, style?: React.CSSProperties }) => {
  return (
    <div className={`card-premium ${className}`} style={style}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm font-medium text-slate-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
