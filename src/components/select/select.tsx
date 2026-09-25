import type { ComponentPropsWithRef, ReactElement } from "react";
import { ChevronsUpDown } from "lucide-react";
import { cx } from "../../lib/classes.js";
import { Field, useFieldIds } from "../field/field.js";
import type { FieldOptions, FieldVariant } from "../field/field.js";
import styles from "../field/field.module.css";

export interface SelectProps
  extends ComponentPropsWithRef<"select">, FieldOptions {
  variant?: FieldVariant;
}
/** Native select: pass option and optgroup children. */
export const Select = ({
  label,
  labelHidden,
  description,
  error,
  id,
  className,
  variant = "filled",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: SelectProps): ReactElement => {
  const ids = useFieldIds(id, description, error, describedBy);
  return (
    <Field
      label={label}
      labelHidden={labelHidden ?? false}
      ids={ids}
      {...(description !== undefined && { description })}
      {...(error !== undefined && { error })}
    >
      <div className={styles.selectWrap}>
        <select
          {...props}
          id={ids.id}
          data-variant={variant}
          className={cx(styles.control, className)}
          aria-describedby={ids.describedBy}
          aria-invalid={error ? true : invalid}
        />
        <ChevronsUpDown
          size={14}
          strokeWidth={1.8}
          className={styles.selectIcon}
          aria-hidden="true"
        />
      </div>
    </Field>
  );
};
