import { useCallback, cloneElement } from "react";
import type { HTMLProps, ReactElement, ReactNode } from "react";
import {
  FloatingFocusManager,
  FloatingPortal,
  safePolygon,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";
import { useControllable } from "../../lib/use-controllable.js";
import { cx } from "../../lib/classes.js";
import {
  floatingAutoUpdate,
  floatingMiddleware,
} from "../../lib/floating-position.js";
import type { FloatingBoundary } from "../../lib/floating-position.js";
import { OverlayTheme } from "../theme/theme.js";
import styles from "./popover.module.css";

export interface PopoverProps {
  trigger: ReactElement<HTMLProps<HTMLElement>>;
  label: string;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  /** Optional collision boundary; the overlay also remains within the viewport. */
  boundary?: FloatingBoundary | null;
  className?: string;
  /** Hover also keeps click and keyboard activation available. */
  openOn?: "click" | "hover";
}
export const Popover = ({
  trigger,
  label,
  children,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  boundary,
  className,
  openOn = "click",
}: PopoverProps): ReactElement => {
  const [open, setOpen] = useControllable(
    controlled,
    defaultOpen,
    onOpenChange,
  );
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
    middleware: floatingMiddleware(6, boundary, "end"),
    whileElementsMounted: floatingAutoUpdate(boundary),
  });
  const click = useClick(context);
  const hover = useHover(context, {
    enabled: openOn === "hover",
    delay: { open: 80, close: 150 },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context, { enabled: openOn === "hover" });
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
  const role = useRole(context, { role: "dialog" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    hover,
    focus,
    dismiss,
    role,
  ]);
  const ref = useMergeRefs([setReference, trigger.props.ref]);
  return (
    <>
      {cloneElement(trigger, { ...getReferenceProps(trigger.props), ref })}
      {open && (
        <FloatingPortal>
          <OverlayTheme>
            <FloatingFocusManager
              context={context}
              modal={false}
              returnFocus
              initialFocus={openOn === "hover" ? -1 : 0}
            >
              <div
                ref={setFloating}
                style={floatingStyles}
                data-placement={actualPlacement}
                className={cx(styles.popover, className)}
                {...getFloatingProps()}
                aria-label={label}
              >
                {children}
              </div>
            </FloatingFocusManager>
          </OverlayTheme>
        </FloatingPortal>
      )}
    </>
  );
};
