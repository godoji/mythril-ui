import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { cx } from "../../lib/classes.js";
import styles from "./choice-button.module.css";

export interface ChoiceButtonProps extends Omit<
  ComponentPropsWithRef<"button">,
  "children"
> {
  label: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
  /** Quiet emphasis for a recommended option. */
  highlighted?: boolean;
}

/** Full-width option action with consistent label and accessory spacing. */
export const ChoiceButton = ({
  label,
  description,
  trailing,
  highlighted = false,
  type = "button",
  className,
  ...props
}: ChoiceButtonProps): ReactElement => (
  <button
    {...props}
    type={type}
    data-highlighted={highlighted}
    className={cx(styles.choice, className)}
  >
    <span className={styles.body}>
      <span className={styles.label}>{label}</span>
      {description && <span className={styles.description}>{description}</span>}
    </span>
    {trailing && <span className={styles.trailing}>{trailing}</span>}
  </button>
);
