import type { ComponentPropsWithRef, ReactElement } from "react";
import { cx } from "../../lib/classes.js";
import styles from "./code-text.module.css";

export interface CodeTextProps extends Omit<
  ComponentPropsWithRef<"pre">,
  "children"
> {
  code: string;
  /** Diff line colors preserve the original text, including patch envelopes. */
  format?: "plain" | "diff";
  tone?: "default" | "muted" | "danger" | "success" | "accent";
}

const lineTone = (line: string): string => {
  if (line.startsWith("***") || line.startsWith("@@")) return "header";
  if (line.startsWith("+")) return "added";
  if (line.startsWith("-")) return "removed";
  return "context";
};

/** Escaped, wrapping code text without a toolbar, surface, or syntax dependency. */
export const CodeText = ({
  code,
  format = "plain",
  tone = "default",
  className,
  ...props
}: CodeTextProps): ReactElement => (
  <pre {...props} className={cx(styles.text, className)} data-tone={tone}>
    <code>
      {format === "diff"
        ? code.split("\n").map((line, index, lines) => (
            <span key={index} data-line={lineTone(line)}>
              {line}
              {index < lines.length - 1 ? "\n" : ""}
            </span>
          ))
        : code}
    </code>
  </pre>
);
