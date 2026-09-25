import type { ComponentPropsWithRef, ReactElement } from "react";
import { cx } from "../../lib/classes.js";
import styles from "./status-badge.module.css";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";
export interface StatusBadgeProps extends ComponentPropsWithRef<"span"> {
  tone?: StatusTone;
}
/** Pass the status as visible text; meaning never depends on color alone. */
export const StatusBadge = ({
  tone = "neutral",
  className,
  ...props
}: StatusBadgeProps): ReactElement => (
  <span {...props} data-tone={tone} className={cx(styles.badge, className)} />
);
