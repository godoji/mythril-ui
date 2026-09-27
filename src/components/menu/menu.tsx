import { useCallback, cloneElement, useEffect, useRef, useState } from "react";
import type {
  HTMLProps,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactElement,
} from "react";
import {
  FloatingFocusManager,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";
import {
  floatingAutoUpdate,
  floatingMiddleware,
} from "../../lib/floating-position.js";
import type { FloatingBoundary } from "../../lib/floating-position.js";
import { OverlayTheme } from "../theme/theme.js";
import styles from "./menu.module.css";

export interface MenuItem {
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
}
export interface MenuProps {
  trigger: ReactElement<HTMLProps<HTMLElement>>;
  label: string;
  items: readonly MenuItem[];
  placement?: Placement;
  /** Optional collision boundary; the menu also remains within the viewport. */
  boundary?: FloatingBoundary | null;
  /** Context invocation is also available through the ContextMenu wrapper. */
  openOn?: "click" | "contextmenu";
}
/** A single-level action menu with arrow keys, Home/End, and typeahead. */
export const Menu = ({
  trigger,
  label,
  items,
  placement = "bottom-end",
  boundary,
  openOn = "click",
}: MenuProps): ReactElement => {
  const [open, setOpen] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<(HTMLElement | null)[]>([]);
  const labelsRef = useRef<(string | null)[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);
  const firstEnabled = items.findIndex((item) => !item.disabled);
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
    middleware: floatingMiddleware(4, boundary, "end"),
    whileElementsMounted: floatingAutoUpdate(boundary),
  });
  const click = useClick(context, { enabled: openOn === "click" });
  const setFloating = useCallback(
    (node: HTMLDivElement | null): void => {
      refs.setFloating(node);
    },
    [refs],
  );
  const setReference = useCallback(
    (node: HTMLElement | null): void => {
      triggerRef.current = node;
      refs.setReference(node);
    },
    [refs],
  );
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });
  const navigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
    disabledIndices: items.flatMap((item, index) =>
      item.disabled ? [index] : [],
    ),
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, navigation, typeahead],
  );
  useEffect(() => {
    if (!open || openOn !== "contextmenu") return;
    if (firstEnabled >= 0) listRef.current[firstEnabled]?.focus();
  }, [firstEnabled, open, openOn]);
  const openAt = (x: number, y: number): void => {
    const contextElement = triggerRef.current;
    refs.setPositionReference({
      getBoundingClientRect: () => ({
        x,
        y,
        top: y,
        bottom: y,
        left: x,
        right: x,
        width: 0,
        height: 0,
      }),
      ...(contextElement && { contextElement }),
    });
    setActiveIndex(firstEnabled);
    setOpen(true);
  };
  const ref = useMergeRefs([setReference, trigger.props.ref]);
  /* eslint-disable react-hooks/refs -- Context-menu handlers read refs only when invoked, never during render. */
  return (
    <>
      {cloneElement(trigger, {
        ...getReferenceProps({
          ...trigger.props,
          onPointerDown: (event: PointerEvent<HTMLElement>) => {
            trigger.props.onPointerDown?.(event);
            setKeyboardFocus(false);
          },
          onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
            trigger.props.onKeyDown?.(event);
            setKeyboardFocus(true);
          },
        }),
        ...(openOn === "contextmenu" && {
          onContextMenu: (event: MouseEvent<HTMLElement>): void => {
            trigger.props.onContextMenu?.(event);
            if (event.defaultPrevented) return;
            event.preventDefault();
            openAt(event.clientX, event.clientY);
          },
          onKeyDown: (event: KeyboardEvent<HTMLElement>): void => {
            trigger.props.onKeyDown?.(event);
            setKeyboardFocus(true);
            if (event.defaultPrevented) return;
            if (
              event.key !== "ContextMenu" &&
              !(event.shiftKey && event.key === "F10")
            )
              return;
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            openAt(rect.left, rect.bottom);
          },
        }),
        ref,
      })}
      {open && (
        <FloatingPortal>
          <OverlayTheme>
            <FloatingFocusManager context={context} modal={false} returnFocus>
              <div
                ref={setFloating}
                style={floatingStyles}
                data-placement={actualPlacement}
                className={styles.menu}
                data-keyboard-focus={keyboardFocus}
                {...getFloatingProps({
                  onKeyDown: () => {
                    setKeyboardFocus(true);
                  },
                  onPointerDown: () => {
                    setKeyboardFocus(false);
                  },
                })}
                aria-labelledby={undefined}
                aria-label={label}
              >
                {items.map((item, index) => (
                  <button
                    type="button"
                    key={item.id}
                    role="menuitem"
                    disabled={item.disabled}
                    tabIndex={activeIndex === index ? 0 : -1}
                    data-danger={item.danger}
                    className={styles.item}
                    ref={(node) => {
                      listRef.current[index] = node;
                      labelsRef.current[index] = item.disabled
                        ? null
                        : item.label;
                    }}
                    {...getItemProps({
                      onClick: (): void => {
                        setOpen(false);
                        item.onSelect();
                      },
                    })}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </FloatingFocusManager>
          </OverlayTheme>
        </FloatingPortal>
      )}
    </>
  );
  /* eslint-enable react-hooks/refs */
};
