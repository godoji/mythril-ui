/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- APG's focusable separator is an adjustable widget. */
import { useId, useLayoutEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
} from "react";
import { useControllable } from "../../lib/use-controllable.js";
import { cx } from "../../lib/classes.js";
import styles from "./resizable-panels.module.css";

const separatorSize = 4;

export interface ResizablePanelsProps {
  primary: ReactNode;
  secondary: ReactNode;
  primaryLabel: string;
  orientation?: "horizontal" | "vertical";
  /** Primary pane size in pixels. */
  size?: number;
  defaultSize?: number;
  onSizeChange?: (size: number) => void;
  minSize?: number;
  maxSize?: number;
  minSecondarySize?: number;
  collapsible?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Two panes with a keyboard-operable, draggable separator. */
export const ResizablePanels = ({
  primary,
  secondary,
  primaryLabel,
  orientation = "horizontal",
  size: controlledSize,
  defaultSize = 240,
  onSizeChange,
  minSize = 120,
  maxSize = Number.POSITIVE_INFINITY,
  minSecondarySize = 120,
  collapsible = false,
  className,
  style,
}: ResizablePanelsProps): ReactElement => {
  const rootRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    coordinate: number;
    size: number;
  } | null>(null);
  const lastExpandedRef = useRef(defaultSize);
  const [extent, setExtent] = useState(0);
  const [size, setSize] = useControllable(
    controlledSize,
    defaultSize,
    onSizeChange,
  );
  const paneId = useId();
  const horizontal = orientation === "horizontal";
  const axis = horizontal ? "clientX" : "clientY";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = (): void => {
      const rect = root.getBoundingClientRect();
      setExtent(orientation === "horizontal" ? rect.width : rect.height);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => {
      observer.disconnect();
    };
  }, [orientation]);

  const minimum = Math.max(0, minSize);
  const maximum = Math.max(
    0,
    Math.min(
      maxSize,
      extent > 0 ? extent - minSecondarySize - separatorSize : maxSize,
    ),
  );
  const expandedMinimum = Math.min(minimum, maximum);
  const clamp = (next: number): number =>
    Math.max(expandedMinimum, Math.min(maximum, next));
  const displayedSize = collapsible && size === 0 ? 0 : clamp(size);
  const collapsed = collapsible && displayedSize === 0;
  useLayoutEffect(() => {
    if (collapsed && primaryRef.current?.contains(document.activeElement)) {
      separatorRef.current?.focus();
    }
  }, [collapsed]);
  const resize = (next: number): void => {
    const bounded = collapsible && next <= 0 ? 0 : clamp(next);
    if (bounded > 0) lastExpandedRef.current = bounded;
    setSize(bounded);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const rtl =
      horizontal && getComputedStyle(event.currentTarget).direction === "rtl";
    const step = event.shiftKey ? 50 : 10;
    const key = event.key;
    let next: number;
    if (key === "Enter" && collapsible) {
      next = displayedSize === 0 ? clamp(lastExpandedRef.current) : 0;
    } else if (key === "Home") {
      next = collapsible ? 0 : expandedMinimum;
    } else if (key === "End") {
      next = maximum;
    } else if (horizontal && (key === "ArrowLeft" || key === "ArrowRight")) {
      const direction = (key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);
      next = displayedSize + direction * step;
    } else if (!horizontal && (key === "ArrowUp" || key === "ArrowDown")) {
      next = displayedSize + (key === "ArrowDown" ? 1 : -1) * step;
    } else return;
    event.preventDefault();
    resize(next);
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      coordinate: event[axis],
      size: displayedSize,
    };
    if ("setPointerCapture" in event.currentTarget) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const rtl =
      orientation === "horizontal" &&
      getComputedStyle(event.currentTarget).direction === "rtl";
    const delta = (event[axis] - drag.coordinate) * (rtl ? -1 : 1);
    resize(drag.size + delta);
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>): void => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (
      "hasPointerCapture" in event.currentTarget &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const position = extent > 0 ? Math.round((displayedSize / extent) * 100) : 0;
  const minPosition =
    extent > 0 ? Math.round((expandedMinimum / extent) * 100) : 0;
  const maxPosition = extent > 0 ? Math.round((maximum / extent) * 100) : 100;
  return (
    <div
      ref={rootRef}
      className={cx(styles.root, className)}
      data-orientation={orientation}
      style={
        {
          ...style,
          "--mythril-primary-size": `${String(displayedSize)}px`,
        } as CSSProperties
      }
    >
      <div
        ref={primaryRef}
        id={paneId}
        className={styles.pane}
        data-pane="primary"
        inert={collapsed}
        aria-hidden={collapsed}
      >
        {primary}
      </div>
      <div
        ref={separatorRef}
        role="separator"
        tabIndex={0}
        aria-label={primaryLabel}
        aria-controls={paneId}
        aria-orientation={horizontal ? "vertical" : "horizontal"}
        aria-valuemin={collapsible ? 0 : minPosition}
        aria-valuemax={maxPosition}
        aria-valuenow={position}
        aria-valuetext={`${String(Math.round(displayedSize))} pixels`}
        className={styles.separator}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
      <div className={styles.pane} data-pane="secondary">
        {secondary}
      </div>
    </div>
  );
};
