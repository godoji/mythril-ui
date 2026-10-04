import { useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

/** Keep portaled controls in sync with native disabled fieldset inheritance. */
export const useNativeDisabled = (
  ref: RefObject<HTMLInputElement | null>,
  disabled: boolean,
): boolean => {
  const [nativeDisabled, setNativeDisabled] = useState(disabled);
  useLayoutEffect(() => {
    const input = ref.current;
    if (!input) return;
    const sync = (): void => {
      setNativeDisabled(input.matches(":disabled"));
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(input, {
      attributes: true,
      attributeFilter: ["disabled"],
    });
    let ancestor = input.parentElement;
    while (ancestor) {
      if (ancestor.tagName === "FIELDSET") {
        observer.observe(ancestor, {
          attributes: true,
          attributeFilter: ["disabled"],
        });
      }
      ancestor = ancestor.parentElement;
    }
    return () => {
      observer.disconnect();
    };
  }, [disabled, ref]);
  return disabled || nativeDisabled;
};
