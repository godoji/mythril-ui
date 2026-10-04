import type { ComponentPropsWithRef, ReactElement } from "react";
import { cx } from "../../lib/classes.js";
import styles from "./progress.module.css";

export interface ProgressProps extends Omit<
  ComponentPropsWithRef<"progress">,
  "children" | "value" | "max" | "aria-label"
> {
  /** Accessible name; the bar does not add a visible label. */
  label: string;
  /** Omit the value for indeterminate progress. Zero is a known starting value. */
  value?: number | undefined;
  /** Positive maximum, defaulting to 1. */
  max?: number;
}

/** Native progress for a task, distinct from a usage or capacity meter. */
export const Progress = ({
  label,
  value,
  max = 1,
  className,
  ...props
}: ProgressProps): ReactElement => {
  const maximum = Number.isFinite(max) && max > 0 ? max : 1;
  const current =
    value !== undefined && Number.isFinite(value)
      ? Math.min(maximum, Math.max(0, value))
      : undefined;
  return (
    <progress
      {...props}
      aria-label={label}
      value={current}
      max={maximum}
      className={cx(styles.progress, className)}
    />
  );
};
