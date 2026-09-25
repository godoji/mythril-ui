import type { ComponentPropsWithRef, ReactElement } from "react";
import { cx } from "../../lib/classes.js";
import { Field, useFieldIds } from "../field/field.js";
import type { FieldOptions, FieldVariant } from "../field/field.js";
import styles from "../field/field.module.css";

export interface TextInputProps
  extends Omit<ComponentPropsWithRef<"input">, "size" | "type">, FieldOptions {
  type?:
    | "text"
    | "email"
    | "password"
    | "search"
    | "tel"
    | "url"
    | "number"
    | "date"
    | "time"
    | "datetime-local";
  variant?: FieldVariant;
}
export const TextInput = ({
  label,
  labelHidden,
  description,
  error,
  id,
  className,
  type = "text",
  variant = "filled",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextInputProps): ReactElement => {
  const ids = useFieldIds(id, description, error, describedBy);
  return (
    <Field
      label={label}
      labelHidden={labelHidden ?? false}
      ids={ids}
      {...(description !== undefined && { description })}
      {...(error !== undefined && { error })}
    >
      <input
        {...props}
        id={ids.id}
        type={type}
        data-variant={variant}
        className={cx(styles.control, className)}
        aria-describedby={ids.describedBy}
        aria-invalid={error ? true : invalid}
      />
    </Field>
  );
};
