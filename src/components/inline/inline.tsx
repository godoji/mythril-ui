import type { ComponentPropsWithRef, ReactElement } from "react";
import { cx } from "../../lib/classes.js";
import type { SpaceToken } from "../../lib/spacing.js";
import styles from "./inline.module.css";

export type InlineGap = SpaceToken;
export type InlineAlign = "start" | "center" | "end" | "baseline" | "stretch";

export interface InlineProps extends ComponentPropsWithRef<"div"> {
  /** Space between children, using the Mythril spacing scale. */
  gap?: InlineGap;
  /** Cross-axis alignment. Use end to align buttons with labeled controls. */
  align?: InlineAlign;
  /** Allow children to wrap when there is not enough width. */
  wrap?: boolean;
}

/** Horizontal layout with token-based spacing and explicit alignment. */
export const Inline = ({
  gap = "2",
  align = "center",
  wrap = true,
  className,
  ...props
}: InlineProps): ReactElement => (
  <div
    {...props}
    data-gap={gap}
    data-align={align}
    data-wrap={wrap}
    className={cx(styles.inline, className)}
  />
);
