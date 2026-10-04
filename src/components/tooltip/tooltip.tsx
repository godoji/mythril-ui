import { useCallback, cloneElement, useState } from "react";
import type { HTMLProps, MouseEvent, ReactElement } from "react";
import {
  FloatingPortal,
  safePolygon,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";
import {
  floatingAutoUpdate,
  floatingMiddleware,
} from "../../lib/floating-position.js";
import type { FloatingBoundary } from "../../lib/floating-position.js";
import { OverlayTheme } from "../theme/theme.js";
import styles from "./tooltip.module.css";

export interface TooltipProps {
  label: string;
  /** A focusable element or component that forwards its ref and DOM props. */
  children: ReactElement<HTMLProps<HTMLElement>>;
  disabled?: boolean;
  placement?: Placement;
  /** Optional collision boundary; the tooltip also remains within the viewport. */
  boundary?: FloatingBoundary | null;
}

export const Tooltip = ({
  label,
  children,
  disabled = false,
  placement = "top",
  boundary,
}: TooltipProps): ReactElement => {
  const [open, setOpen] = useState(false);
  const {
    refs,
    floatingStyles,
    context,
    placement: actualPlacement,
  } = useFloating<HTMLElement>({
    open,
    onOpenChange: setOpen,
    placement,
    strategy: "fixed",
    middleware: floatingMiddleware(6, boundary, "start"),
    whileElementsMounted: floatingAutoUpdate(boundary),
  });
  const hover = useHover(context, {
    mouseOnly: true,
    move: false,
    delay: { open: 300, close: 100 },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const setFloating = useCallback(
    (node: HTMLDivElement | null): void => {
      refs.setFloating(node);
    },
    [refs],
  );
  const setReference = useCallback(
    (node: HTMLElement | null): void => {
      refs.setReference(node);
    },
    [refs],
  );
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);
  const ref = useMergeRefs([setReference, children.props.ref]);
  const trigger = disabled ? (
    <span
      role="group"
      ref={setReference}
      className={styles.disabled}
      tabIndex={children.props.tabIndex ?? 0}
      aria-label={`${label} (unavailable)`}
      {...getReferenceProps()}
    >
      {children}
    </span>
  ) : (
    cloneElement(children, {
      ...getReferenceProps({
        ...children.props,
        onClick: (event: MouseEvent<HTMLElement>): void => {
          setOpen(false);
          children.props.onClick?.(event);
        },
      }),
      ref,
    })
  );
  return (
    <>
      {trigger}
      {open && (
        <FloatingPortal>
          <OverlayTheme>
            <div
              ref={setFloating}
              style={floatingStyles}
              data-placement={actualPlacement}
              className={styles.tooltip}
              {...getFloatingProps()}
            >
              {label}
            </div>
          </OverlayTheme>
        </FloatingPortal>
      )}
    </>
  );
};
