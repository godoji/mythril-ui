import { useId, useRef } from "react";
import type { KeyboardEvent, ReactElement, ReactNode } from "react";
import { useControllable } from "../../lib/use-controllable.js";
import { cx } from "../../lib/classes.js";
import styles from "./tabs.module.css";

export interface TabItem {
  value: string;
  label: ReactNode;
  /** Spoken label when the visible label contains a decorative icon or status. */
  accessibleLabel?: string;
  content: ReactNode;
  disabled?: boolean;
}
export interface TabsProps {
  label: string;
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "underline" | "segmented";
  className?: string;
}
/** Horizontal tabs with automatic keyboard activation; panels remain mounted. */
export const Tabs = ({
  label,
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "underline",
  className,
}: TabsProps): ReactElement => {
  const first = items.find((item) => !item.disabled)?.value ?? "";
  const [selected, setSelected] = useControllable(
    value,
    defaultValue ?? first,
    onValueChange,
  );
  const current = items.some(
    (item) => item.value === selected && !item.disabled,
  )
    ? selected
    : first;
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    const enabled = items.flatMap((item, itemIndex) =>
      item.disabled ? [] : [itemIndex],
    );
    const position = enabled.indexOf(index);
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    let next: number | undefined;
    if (event.key === "Home") next = enabled[0];
    else if (event.key === "End") next = enabled.at(-1);
    else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      const delta = (event.key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);
      next = enabled[(position + delta + enabled.length) % enabled.length];
    } else return;
    event.preventDefault();
    const item = next === undefined ? undefined : items[next];
    if (item && next !== undefined) {
      setSelected(item.value);
      refs.current[next]?.focus();
    }
  };
  return (
    <div className={cx(styles.tabs, className)}>
      <div
        role="tablist"
        aria-label={label}
        className={styles.list}
        data-variant={variant}
      >
        {items.map((item, index) => (
          <button
            key={item.value}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${String(index)}`}
            aria-controls={`${id}-panel-${String(index)}`}
            aria-selected={current === item.value}
            tabIndex={current === item.value ? 0 : -1}
            disabled={item.disabled}
            className={styles.tab}
            aria-label={item.accessibleLabel}
            onClick={() => {
              setSelected(item.value);
            }}
            onKeyDown={(event) => {
              navigate(event, index);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${id}-panel-${String(index)}`}
          aria-labelledby={`${id}-tab-${String(index)}`}
          hidden={current !== item.value}
          tabIndex={0}
          className={styles.panel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};
