'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div 
        className="fixed flex flex-col gap-3 pointer-events-none" 
        style={{ bottom: '2rem', right: '2rem', zIndex: 1000, position: 'fixed' }}
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div 
                className="flex items-center gap-4 bg-white" 
                style={{ 
                  padding: '1rem 1.5rem', 
                  borderRadius: '1.25rem', 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  border: `1px solid ${t.type === 'success' ? '#dcfce7' : t.type === 'error' ? '#fee2e2' : '#dbeafe'}`,
                  minWidth: '320px'
                }}
              >
                <div 
                  className="flex items-center justify-center rounded-xl"
                  style={{ 
                    width: '2.5rem', 
                    height: '2.5rem',
                    backgroundColor: t.type === 'success' ? '#f0fdf4' : t.type === 'error' ? '#fef2f2' : '#eff6ff',
                    color: t.type === 'success' ? '#166534' : t.type === 'error' ? '#991b1b' : '#1e40af'
                  }}
                >
                  {t.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                  {t.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {t.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <p className="font-black uppercase tracking-widest text-slate-900" style={{ fontSize: '10px' }}>
                    {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Notification'}
                  </p>
                  <p className="font-bold text-slate-500" style={{ fontSize: '12px', marginTop: '2px' }}>{t.message}</p>
                </div>

                <button 
                  onClick={() => removeToast(t.id)}
                  style={{ color: '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
