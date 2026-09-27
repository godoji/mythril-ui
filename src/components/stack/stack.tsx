import type { ComponentPropsWithRef, ReactElement } from "react";
import { cx } from "../../lib/classes.js";
import type { SpaceToken } from "../../lib/spacing.js";
import styles from "./stack.module.css";

export type StackGap = SpaceToken;

export interface StackProps extends ComponentPropsWithRef<"div"> {
  /** Space between children, using the Mythril spacing scale. */
  gap?: StackGap;
}

/** Vertical layout with token-based spacing between children. */
export const Stack = ({
  gap = "3",
  className,
  ...props
}: StackProps): ReactElement => (
  <div {...props} data-gap={gap} className={cx(styles.stack, className)} />
);
