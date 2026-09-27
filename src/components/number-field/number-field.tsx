import type { ComponentPropsWithRef, ReactElement } from "react";
import { Field, useFieldIds } from "../field/field.js";
import type { FieldOptions } from "../field/field.js";
import { cx } from "../../lib/classes.js";
import fieldStyles from "../field/field.module.css";
import styles from "./number-field.module.css";

export interface NumberFieldProps
  extends
    Omit<
      ComponentPropsWithRef<"input">,
      | "type"
      | "value"
      | "defaultValue"
      | "onChange"
      | "size"
      | "prefix"
      | "pattern"
    >,
    FieldOptions {
  /** Raw editable decimal text. Empty, negative and trailing-decimal drafts are preserved. */
  value: string;
  onValueChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  decimalSeparator?: "." | ",";
}
/** Decimal field with units. Conversion, currency precision and range validation belong to the caller. */
export const NumberField = ({
  label,
  labelHidden = false,
  description,
  error,
  id,
  prefix,
  suffix,
  decimalSeparator = ".",
  value,
  onValueChange,
  className,
  "aria-describedby": describedBy,
  ...props
}: NumberFieldProps): ReactElement => {
  const ids = useFieldIds(id, description, error, describedBy);
  return (
    <Field
      label={label}
      labelHidden={labelHidden}
      ids={ids}
      {...(description !== undefined && { description })}
      {...(error !== undefined && { error })}
    >
      <div className={styles.wrap}>
        {prefix && <span aria-hidden="true">{prefix}</span>}
        <input
          {...props}
          id={ids.id}
          type="text"
          inputMode="decimal"
          pattern={
            decimalSeparator === "."
              ? "-?[0-9]+([.][0-9]+)?"
              : "-?[0-9]+(,[0-9]+)?"
          }
          aria-describedby={ids.describedBy}
          aria-invalid={error ? true : props["aria-invalid"]}
          value={value}
          onChange={(event) => {
            onValueChange(event.currentTarget.value);
          }}
          className={cx(fieldStyles.control, styles.input, className)}
          data-variant="outline"
        />
        {suffix && <span aria-hidden="true">{suffix}</span>}
      </div>
    </Field>
  );
};
