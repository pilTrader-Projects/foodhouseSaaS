import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './ui.css';

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
          {title && <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>}
          {subtitle && <p className="text-10 font-black text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * Modal Component
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="modal-overlay"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.4)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 2000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-content"
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '2.5rem', 
              padding: '3rem', 
              width: '100%', 
              maxWidth: '32rem', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
            }}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                {title && <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>}
                {subtitle && <p className="text-10 font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
              </div>
              <button 
                onClick={onClose} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.5rem' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
