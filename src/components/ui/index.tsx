import React from 'react';
import './ui.css';

// Re-export components
export { Modal } from './modal';

/**
 * Badge Component
 */
export const Badge = ({ children, variant = 'default', size = 'sm', className = '', style }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'dark', size?: 'sm' | 'xs', className?: string, style?: React.CSSProperties }) => {
  const variants = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    dark: 'badge-dark'
  };

  const sizes = {
    sm: 'badge-sm',
    xs: 'badge-xs'
  };

  return (
    <span className={`ui-badge ${variants[variant]} ${sizes[size]} ${className}`} style={style}>
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
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    ghost: '', 
    outline: 'btn-secondary', 
    dark: 'btn-dark'
  };

  const heightClass = size === 'xs' ? 'h-10' : 'h-12';

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`ui-btn ${variants[variant]} ${heightClass} ${className}`}
      style={style}
    >
      {Icon && !loading && <Icon className="w-3.5 h-3.5" />}
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
    <div className={`ui-card ${className}`} style={style}>
      {(title || subtitle) && (
        <div className="mb-6 mr-4">
          {title && <h3 className="text-xl font-black text-main uppercase tracking-tight">{title}</h3>}
          {subtitle && <p className="text-10 font-black text-muted uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
