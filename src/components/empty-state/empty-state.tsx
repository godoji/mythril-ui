import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { cx } from "../../lib/classes.js";
import styles from "./empty-state.module.css";

export interface EmptyStateProps extends ComponentPropsWithRef<"div"> {
  title: string;
  description?: string;
  actions?: ReactNode;
}
/** Compact placeholder for an empty list or section. */
export const EmptyState = ({
  title,
  description,
  actions,
  className,
  ...props
}: EmptyStateProps): ReactElement => (
  <div {...props} className={cx(styles.root, className)}>
    <strong>{title}</strong>
    {description && <p>{description}</p>}
    {actions && <div className={styles.actions}>{actions}</div>}
  </div>
);
