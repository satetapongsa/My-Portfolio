import { AnimatePresence, motion } from 'motion/react';
import { CircleAlert, Check } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type ToastTone = 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<number, number>());
  const nextId = useRef(0);

  const notify = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = ++nextId.current;
    setToasts((list) => [...list.slice(-2), { id, message, tone }]);
    const timer = window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, 2600);
    timers.current.set(id, timer);
  }, []);

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`toast toast--${t.tone}`}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {t.tone === 'success' ? <Check aria-hidden /> : <CircleAlert aria-hidden />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
