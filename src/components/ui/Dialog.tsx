import { AnimatePresence, motion, type Transition } from 'motion/react';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import './dialog.css';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog. */
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
  panelClassName?: string;
  variant?: 'center' | 'palette';
  initialFocus?: RefObject<HTMLElement | null>;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const panelTransition: Transition = { duration: 0.32, ease: [0.16, 1, 0.3, 1] };

let openDialogs = 0;

/**
 * Accessible modal: traps focus, closes on Escape / backdrop click, locks page
 * scroll and restores focus to whatever opened it.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  children,
  panelClassName = '',
  variant = 'center',
  initialFocus,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    openDialogs += 1;
    document.documentElement.classList.add('wave-scroll-lock');

    // The panel mounts in the same commit, so focus can move immediately.
    const target = initialFocus?.current ?? panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? panelRef.current;
    target?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement,
      );
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      openDialogs -= 1;
      if (openDialogs === 0) document.documentElement.classList.remove('wave-scroll-lock');
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, initialFocus]);

  const panelMotion =
    variant === 'palette'
      ? { initial: { opacity: 0, y: -12, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8, scale: 0.98 } }
      : { initial: { opacity: 0, y: 28, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 18, scale: 0.98 } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`dialog dialog--${variant}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            tabIndex={-1}
            className={`dialog__panel ${panelClassName}`}
            transition={panelTransition}
            {...panelMotion}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
