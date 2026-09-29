import type { ComponentPropsWithRef, ReactElement } from "react";
import { cx } from "../../lib/classes.js";
import styles from "./status-badge.module.css";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";
export interface StatusBadgeProps extends ComponentPropsWithRef<"span"> {
  tone?: StatusTone;
  size?: "default" | "small";
}
/** Pass the status as visible text; meaning never depends on color alone. */
export const StatusBadge = ({
  tone = "neutral",
  size = "default",
  className,
  ...props
}: StatusBadgeProps): ReactElement => (
  <span
    {...props}
    data-tone={tone}
    data-size={size}
    className={cx(styles.badge, className)}
  />
);
