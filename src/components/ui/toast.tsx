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
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border min-w-[300px]
                ${t.type === 'success' ? 'bg-white border-green-100' : 
                  t.type === 'error' ? 'bg-white border-rose-100' : 
                  'bg-white border-blue-100'}
              `}>
                <div className={`
                  w-8 h-8 rounded-xl flex items-center justify-center
                  ${t.type === 'success' ? 'bg-green-50 text-green-600' : 
                    t.type === 'error' ? 'bg-rose-50 text-rose-600' : 
                    'bg-blue-50 text-blue-600'}
                `}>
                  {t.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                  {t.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {t.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase text-slate-800 leading-tight">
                    {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Notification'}
                  </p>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">{t.message}</p>
                </div>

                <button 
                  onClick={() => removeToast(t.id)}
                  className="text-slate-300 hover:text-slate-500 transition-colors"
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
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
