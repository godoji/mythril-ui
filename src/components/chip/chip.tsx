import type { ComponentPropsWithRef, ReactElement } from "react";
import { X } from "lucide-react";
import { cx } from "../../lib/classes.js";
import styles from "./chip.module.css";

export type ChipProps = ComponentPropsWithRef<"span"> & {
  disabled?: boolean;
} & (
    | { onRemove: () => void; removeLabel: string }
    | { onRemove?: never; removeLabel?: never }
  );
/** Compact value or filter token, optionally removable. */
export const Chip = ({
  onRemove,
  removeLabel,
  disabled,
  children,
  className,
  ...props
}: ChipProps): ReactElement => (
  <span {...props} className={cx(styles.chip, className)}>
    <span className={styles.text}>{children}</span>
    {onRemove && (
      <button
        type="button"
        className={styles.remove}
        aria-label={removeLabel}
        disabled={disabled}
        onClick={onRemove}
      >
        <X size={12} aria-hidden="true" />
      </button>
    )}
  </span>
);
