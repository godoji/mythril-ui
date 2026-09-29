import type { ComponentPropsWithRef, ReactElement } from "react";
import { LoaderCircle } from "lucide-react";
import { cx } from "../../lib/classes.js";
import styles from "./loading-state.module.css";

export interface LoadingStateProps extends ComponentPropsWithRef<"div"> {
  label?: string;
  inline?: boolean;
}
/** Quiet status for operations that take long enough to need visible feedback. */
export const LoadingState = ({
  label = "Loading…",
  inline = false,
  className,
  ...props
}: LoadingStateProps): ReactElement => (
  <div
    {...props}
    role="status"
    data-inline={inline}
    className={cx(styles.root, className)}
  >
    <span>{label}</span>
    <LoaderCircle size={16} aria-hidden="true" className={styles.icon} />
  </div>
);
