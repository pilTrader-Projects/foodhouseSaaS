import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Unified Premium Modal Component
 * Uses Vanilla CSS classes from ui.css for robust rendering.
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children,
  maxWidth = 'max-w-lg'
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  title: string, 
  subtitle?: string, 
  children: React.ReactNode,
  maxWidth?: string
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          {/* Backdrop (Backdrop-blur handled via CSS) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`modal-content ${maxWidth}`}
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
                {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>}
              </div>
              <button 
                onClick={onClose} 
                className="modal-close-btn"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
