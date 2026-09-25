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
import styles from "./drawer.module.css";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "start" | "end";
  size?: "small" | "medium";
  initialFocus?: RefObject<HTMLElement | null>;
  closeLabel?: string;
}

/** Modal side panel for navigation or multi-step editing. */
export const Drawer = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "start",
  size = "small",
  initialFocus,
  closeLabel = "Close panel",
}: DrawerProps): ReactElement | null => {
  const titleId = useId();
  const descriptionId = useId();
  const { refs, context } = useFloating({ open, onOpenChange });
  const setFloating = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );
  const dismiss = useDismiss(context, { outsidePress: true });
  const role = useRole(context, { role: "dialog" });
  const { getFloatingProps } = useInteractions([dismiss, role]);
  if (!open) return null;
  return (
    <FloatingPortal>
      <OverlayTheme>
        <FloatingOverlay lockScroll className={styles.overlay} data-side={side}>
          <FloatingFocusManager
            context={context}
            initialFocus={initialFocus ?? 0}
            returnFocus
          >
            <div
              {...getFloatingProps()}
              ref={setFloating}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={description ? descriptionId : undefined}
              className={styles.drawer}
              data-size={size}
            >
              <header className={styles.header}>
                <div>
                  <h2 id={titleId}>{title}</h2>
                  {description && <p id={descriptionId}>{description}</p>}
                </div>
                <IconButton
                  icon={X}
                  label={closeLabel}
                  onClick={() => {
                    onOpenChange(false);
                  }}
                />
              </header>
              <div className={styles.body}>{children}</div>
              {footer && <footer className={styles.footer}>{footer}</footer>}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      </OverlayTheme>
    </FloatingPortal>
  );
};
