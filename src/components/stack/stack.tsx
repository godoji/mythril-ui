import type { ComponentPropsWithRef, ReactElement } from "react";
import { cx } from "../../lib/classes.js";
import type { SpaceToken } from "../../lib/spacing.js";
import styles from "./stack.module.css";

export type StackGap = SpaceToken;

interface StackOptions {
  /** Space between children, using the Mythril spacing scale. */
  gap?: StackGap;
}
export type StackProps =
  | (StackOptions & { as?: "div" } & ComponentPropsWithRef<"div">)
  | (StackOptions & { as: "form" } & ComponentPropsWithRef<"form">)
  | (StackOptions & { as: "section" } & ComponentPropsWithRef<"section">);

/** Vertical layout with token-based spacing between children. */
export const Stack = (props: StackProps): ReactElement => {
  const { as, gap = "3", className, ...elementProps } = props;
  if (as === "form") {
    return (
      <form
        {...(elementProps as ComponentPropsWithRef<"form">)}
        data-gap={gap}
        className={cx(styles.stack, className)}
      />
    );
  }
  if (as === "section") {
    return (
      <section
        {...elementProps}
        data-gap={gap}
        className={cx(styles.stack, className)}
      />
    );
  }
  return (
    <div
      {...(elementProps as ComponentPropsWithRef<"div">)}
      data-gap={gap}
      className={cx(styles.stack, className)}
    />
  );
};
