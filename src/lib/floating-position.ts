import type { RefObject } from "react";
import { autoUpdate, flip, offset, shift, size } from "@floating-ui/react";
import type { Middleware, ReferenceType } from "@floating-ui/react";

/** The visible area an anchored overlay must fit within, in addition to the viewport. */
export type FloatingBoundary = HTMLElement | RefObject<HTMLElement | null>;

const resolveBoundary = (
  boundary: FloatingBoundary | null | undefined,
): HTMLElement | undefined =>
  boundary && "current" in boundary
    ? (boundary.current ?? undefined)
    : (boundary ?? undefined);

export const floatingMiddleware = (
  gap: number,
  boundary: FloatingBoundary | null | undefined,
  fallbackAxisSideDirection: "start" | "end",
): Middleware[] => {
  const overflowOptions = (): { padding: number; boundary?: HTMLElement } => {
    const element = resolveBoundary(boundary);
    return element ? { padding: 8, boundary: element } : { padding: 8 };
  };

  return [
    offset(gap),
    flip(() => ({
      ...overflowOptions(),
      crossAxis: "alignment",
      fallbackAxisSideDirection,
    })),
    shift(() => overflowOptions()),
    size(() => ({
      ...overflowOptions(),
      apply: ({ availableWidth, availableHeight, elements }): void => {
        elements.floating.style.setProperty(
          "--mythril-available-width",
          `${String(Math.max(0, availableWidth))}px`,
        );
        elements.floating.style.setProperty(
          "--mythril-available-height",
          `${String(Math.max(0, availableHeight))}px`,
        );
      },
    })),
  ];
};

/** Keep a custom boundary's dimensions live even when it is not an anchor ancestor. */
export const floatingAutoUpdate =
  (
    boundary: FloatingBoundary | null | undefined,
  ): ((
    reference: ReferenceType,
    floating: HTMLElement,
    update: () => void,
  ) => () => void) =>
  (reference, floating, update) => {
    const stop = autoUpdate(reference, floating, update);
    const element = resolveBoundary(boundary);
    if (!element || typeof ResizeObserver === "undefined") return stop;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      observer.disconnect();
      stop();
    };
  };
