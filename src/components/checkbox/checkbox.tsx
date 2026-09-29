import { useEffect, useRef } from "react";
import type { ComponentPropsWithRef, ReactElement } from "react";
import { useMergeRefs } from "@floating-ui/react";
import { Check, Minus } from "lucide-react";
import { cx } from "../../lib/classes.js";
import { Field, useFieldIds } from "../field/field.js";
import type { FieldOptions } from "../field/field.js";
import styles from "../field/field.module.css";

export interface CheckboxProps
  extends
    Omit<ComponentPropsWithRef<"input">, "type" | "size" | "children">,
    FieldOptions {
  indeterminate?: boolean;
}
export const Checkbox = ({
  label,
  description,
  error,
  id,
  className,
  ref,
  indeterminate = false,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: CheckboxProps): ReactElement => {
  const ids = useFieldIds(id, description, error, describedBy);
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs([inputRef, ref]);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <Field
      inline
      label={label}
      ids={ids}
      {...(description !== undefined && { description })}
      {...(error !== undefined && { error })}
    >
      <span className={styles.checkboxWrap}>
        <input
          {...props}
          ref={mergedRef}
          id={ids.id}
          type="checkbox"
          className={cx(styles.checkbox, className)}
          aria-describedby={ids.describedBy}
          aria-invalid={error ? true : invalid}
        />
        <span className={styles.checkboxVisual} aria-hidden="true">
          <Check className={styles.checkboxCheck} size={12} strokeWidth={3} />
          <Minus className={styles.checkboxMinus} size={12} strokeWidth={3} />
        </span>
      </span>
    </Field>
  );
};
