import { useEffect, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";

/** Reset custom state after the owning form's uncancelled native reset. */
export const useFormReset = (
  ref: RefObject<HTMLElement | null>,
  onReset: () => void,
): void => {
  const resetRef = useRef(onReset);
  useLayoutEffect(() => {
    resetRef.current = onReset;
  });
  useEffect(() => {
    const element = ref.current;
    const form =
      element instanceof HTMLInputElement
        ? element.form
        : element?.closest("form");
    if (!form) return;
    let mounted = true;
    const reset = (event: Event): void => {
      // React's onReset may cancel the event after this DOM listener runs.
      queueMicrotask(() => {
        if (mounted && !event.defaultPrevented) resetRef.current();
      });
    };
    form.addEventListener("reset", reset);
    return () => {
      mounted = false;
      form.removeEventListener("reset", reset);
    };
  }, [ref]);
};
