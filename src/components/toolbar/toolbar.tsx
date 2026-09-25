import { useRef, useState } from "react";
import type { KeyboardEvent, ReactElement } from "react";
import type { LucideIcon } from "lucide-react";
import { IconButton } from "../icon-button/icon-button.js";
import type { ButtonProps } from "../button/button.js";
import { cx } from "../../lib/classes.js";
import styles from "./toolbar.module.css";

export interface ToolbarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onPress: () => void;
  disabled?: boolean;
  pressed?: boolean;
  shortcut?: string;
  variant?: ButtonProps["variant"];
}
export interface ToolbarProps {
  label: string;
  items: readonly ToolbarItem[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/** Compact actions with a single Tab stop and arrow-key navigation. */
export const Toolbar = ({
  label,
  items,
  orientation = "horizontal",
  className,
}: ToolbarProps): ReactElement => {
  const [focusedId, setFocusedId] = useState("");
  const enabled = items.filter((item) => !item.disabled);
  const activeId = enabled.some((item) => item.id === focusedId)
    ? focusedId
    : (enabled[0]?.id ?? "");
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const position = enabled.findIndex((item) => item.id === activeId);
    if (position < 0) return;
    const rtl =
      orientation === "horizontal" &&
      getComputedStyle(event.currentTarget).direction === "rtl";
    let next: ToolbarItem | undefined;
    if (event.key === "Home") next = enabled[0];
    else if (event.key === "End") next = enabled.at(-1);
    else if (
      (orientation === "horizontal" &&
        (event.key === "ArrowRight" || event.key === "ArrowLeft")) ||
      (orientation === "vertical" &&
        (event.key === "ArrowDown" || event.key === "ArrowUp"))
    ) {
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      const direction = (forward ? 1 : -1) * (rtl ? -1 : 1);
      next = enabled[(position + direction + enabled.length) % enabled.length];
    } else return;
    event.preventDefault();
    if (next) {
      setFocusedId(next.id);
      refs.current.get(next.id)?.focus();
    }
  };
  return (
    <div
      role="toolbar"
      aria-label={label}
      aria-orientation={orientation}
      className={cx(styles.toolbar, className)}
      data-orientation={orientation}
      onKeyDown={onKeyDown}
    >
      {items.map((item) => (
        <IconButton
          key={item.id}
          ref={(element) => {
            if (element) refs.current.set(item.id, element);
            else refs.current.delete(item.id);
          }}
          icon={item.icon}
          label={
            item.shortcut ? `${item.label} · ${item.shortcut}` : item.label
          }
          variant={item.variant ?? "ghost"}
          size="small"
          disabled={item.disabled}
          aria-pressed={item.pressed}
          tabIndex={item.id === activeId ? 0 : -1}
          className={styles.item}
          onFocus={() => {
            setFocusedId(item.id);
          }}
          onClick={item.onPress}
        />
      ))}
    </div>
  );
};
