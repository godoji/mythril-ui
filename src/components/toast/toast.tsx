import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactElement, ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { FloatingPortal } from "@floating-ui/react";
import { IconButton } from "../icon-button/icon-button.js";
import { OverlayTheme } from "../theme/theme.js";
import styles from "./toast.module.css";

export type ToastTone = "info" | "success" | "warning" | "danger";
export interface ToastOptions {
  message: string;
  title?: string;
  tone?: ToastTone;
  /** Milliseconds before dismissal; 0 keeps the toast until dismissed. */
  duration?: number;
  action?: ReactNode;
}
interface ToastEntry extends ToastOptions {
  id: number;
}
export interface ToastController {
  show: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}
export interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
  maxVisible?: number;
}

const ToastContext = createContext<ToastController | null>(null);

export const useToast = (): ToastController => {
  const controller = useContext(ToastContext);
  if (!controller) throw new Error("useToast requires a ToastProvider");
  return controller;
};

const ToastItem = ({
  toast,
  duration,
  onDismiss,
}: {
  toast: ToastEntry;
  duration: number;
  onDismiss: (id: number) => void;
}): ReactElement => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const remaining = useRef(duration);
  const previousDuration = useRef(duration);
  const paused = hovered || focused;
  const tone = toast.tone ?? "info";
  useEffect(() => {
    if (previousDuration.current !== duration) {
      previousDuration.current = duration;
      remaining.current = duration;
    }
    if (paused || duration <= 0) return;
    const started = Date.now();
    const timer = window.setTimeout(() => {
      onDismiss(toast.id);
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - started),
      );
    };
  }, [duration, onDismiss, paused, toast.id]);
  const Icon = {
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    danger: CircleAlert,
  }[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={styles.toast}
      data-tone={tone}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <Icon size={16} aria-hidden="true" className={styles.icon} />
      <div className={styles.body}>
        {toast.title && <strong>{toast.title}</strong>}
        <span>{toast.message}</span>
        {toast.action && <div className={styles.action}>{toast.action}</div>}
      </div>
      <IconButton
        icon={X}
        label="Dismiss notification"
        size="small"
        onClick={() => {
          onDismiss(toast.id);
        }}
      />
    </div>
  );
};

/** Transient status queue; the application decides what each toast means. */
export const ToastProvider = ({
  children,
  duration = 5000,
  maxVisible = 3,
}: ToastProviderProps): ReactElement => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);
  const show = useCallback(
    (options: ToastOptions): number => {
      const id = ++nextId.current;
      setToasts((current) =>
        [...current, { ...options, id }].slice(-Math.max(1, maxVisible)),
      );
      return id;
    },
    [maxVisible],
  );
  const dismiss = useCallback((id: number): void => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);
  const controller = useMemo(() => ({ show, dismiss }), [show, dismiss]);
  return (
    <ToastContext.Provider value={controller}>
      {children}
      {toasts.length > 0 && (
        <FloatingPortal>
          <OverlayTheme>
            <div className={styles.viewport}>
              {toasts.map((toast) => (
                <ToastItem
                  key={toast.id}
                  toast={toast}
                  duration={toast.duration ?? duration}
                  onDismiss={dismiss}
                />
              ))}
            </div>
          </OverlayTheme>
        </FloatingPortal>
      )}
    </ToastContext.Provider>
  );
};
