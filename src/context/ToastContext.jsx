// src/context/ToastContext.jsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Info,
  X,
  Gem,
} from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const success = useCallback((msg, duration) => push(msg, 'success', duration), [push]);
  const error = useCallback((msg, duration) => push(msg, 'error', duration), [push]);
  const info = useCallback((msg, duration) => push(msg, 'info', duration), [push]);

  return (
    <ToastContext.Provider value={{ push, success, error, info, dismiss }}>
      {children}

      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-[calc(100vw-2rem)] sm:w-auto sm:max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => {
            const isSuccess = t.type === 'success';
            const isError = t.type === 'error';
            const isInfo = t.type === 'info';

            const palette = isSuccess
              ? {
                  ring: 'border-emerald-200/80',
                  bg: 'bg-gradient-to-br from-white to-emerald-50/60',
                  iconBg: 'bg-emerald-100',
                  iconColor: 'text-emerald-600',
                  title: 'text-emerald-900',
                  bar: 'bg-emerald-500',
                }
              : isError
              ? {
                  ring: 'border-rose-200/80',
                  bg: 'bg-gradient-to-br from-white to-rose-50/60',
                  iconBg: 'bg-rose-100',
                  iconColor: 'text-rose-600',
                  title: 'text-rose-900',
                  bar: 'bg-rose-500',
                }
              : {
                  ring: 'border-amber-200/80',
                  bg: 'bg-gradient-to-br from-white to-amber-50/60',
                  iconBg: 'bg-amber-100',
                  iconColor: 'text-amber-600',
                  title: 'text-amber-900',
                  bar: 'bg-amber-500',
                };

            const Icon = isSuccess ? CheckCircle2 : isError ? XCircle : Info;

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.95, transition: { duration: 0.18 } }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${palette.ring} ${palette.bg} shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl`}
                role="status"
                aria-live="polite"
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${palette.bar}`} />

                <div className="flex items-start gap-3 p-4 pl-5">
                  {/* Icon medallion */}
                  <div className={`shrink-0 w-9 h-9 rounded-xl ${palette.iconBg} flex items-center justify-center`}>
                    <Icon className={`h-4.5 w-4.5 ${palette.iconColor}`} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`text-sm font-semibold tracking-wide ${palette.title}`}>
                      {isSuccess ? 'Success' : isError ? 'Something went wrong' : 'Heads up'}
                    </p>
                    <p className="text-[13px] text-slate-600 mt-0.5 leading-snug font-light">
                      {t.message}
                    </p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => dismiss(t.id)}
                    aria-label="Dismiss notification"
                    className="shrink-0 -mt-0.5 -mr-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </button>
                </div>

                {/* Footer brand mark */}
                <div className="px-5 pb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-slate-400/90">
                  <Gem className="h-2.5 w-2.5 text-amber-500" strokeWidth={2.5} />
                  Shoaib Jewellers
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}