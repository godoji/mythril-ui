import { useCallback, useId } from "react";
import type { ReactElement, ReactNode, RefObject } from "react";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { X } from "lucide-react";
import { IconButton } from "../icon-button/icon-button.js";
import { OverlayTheme } from "../theme/theme.js";
import styles from "./dialog.module.css";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** Focus a safe action such as Cancel. Defaults to the close control. */
  initialFocus?: RefObject<HTMLElement | null>;
  role?: "dialog" | "alertdialog";
  closeLabel?: string;
  dismissOnOutsidePress?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}
export const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  initialFocus,
  role = "dialog",
  closeLabel = "Close dialog",
  dismissOnOutsidePress = false,
  size = "small",
  className,
}: DialogProps): ReactElement | null => {
  const titleId = useId();
  const descriptionId = useId();
  const { refs, context } = useFloating({ open, onOpenChange });
  const setFloating = useCallback(
    (node: HTMLDivElement | null): void => {
      refs.setFloating(node);
    },
    [refs],
  );
  const dismiss = useDismiss(context, { outsidePress: dismissOnOutsidePress });
  const semantics = useRole(context, { role });
  const { getFloatingProps } = useInteractions([dismiss, semantics]);
  if (!open) return null;
  return (
    <FloatingPortal>
      <OverlayTheme>
        <FloatingOverlay lockScroll className={styles.overlay}>
          <FloatingFocusManager
            context={context}
            initialFocus={initialFocus ?? 0}
            returnFocus
          >
            <div
              ref={setFloating}
              className={[styles.dialog, className].filter(Boolean).join(" ")}
              data-size={size}
              {...getFloatingProps()}
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={description ? descriptionId : undefined}
            >
              <header className={styles.header}>
                <h2 id={titleId}>{title}</h2>
                <IconButton
                  icon={X}
                  label={closeLabel}
                  onClick={() => {
                    onOpenChange(false);
                  }}
                />
              </header>
              <div className={styles.body}>
                {description && (
                  <p id={descriptionId} className={styles.description}>
                    {description}
                  </p>
                )}
                {children}
              </div>
              {footer && <footer className={styles.footer}>{footer}</footer>}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      </OverlayTheme>
    </FloatingPortal>
  );
};
