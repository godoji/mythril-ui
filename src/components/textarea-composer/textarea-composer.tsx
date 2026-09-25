import type { ReactElement, ReactNode } from "react";
import { cx } from "../../lib/classes.js";
import { Textarea } from "../textarea/textarea.js";
import type { TextareaProps } from "../textarea/textarea.js";
import styles from "./textarea-composer.module.css";

export interface TextareaComposerProps extends Omit<
  TextareaProps,
  "className" | "variant"
> {
  /** Controls shown below the editor. Submit behavior belongs to the parent form. */
  actions: ReactNode;
  /** Styles the outer surface; textareaClassName styles the native textarea. */
  className?: string;
  textareaClassName?: string;
}

/** A filled multiline input and action row in one editor surface. */
export const TextareaComposer = ({
  actions,
  className,
  textareaClassName,
  error,
  rows = 2,
  ...props
}: TextareaComposerProps): ReactElement => (
  <div className={cx(styles.composer, className)} data-invalid={Boolean(error)}>
    <Textarea
      {...props}
      {...(error !== undefined && { error })}
      rows={rows}
      variant="filled"
      className={cx(styles.textarea, textareaClassName)}
    />
    <div className={styles.actions}>{actions}</div>
  </div>
);
