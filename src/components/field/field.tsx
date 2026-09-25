import { useId } from "react";
import type { ReactElement, ReactNode } from "react";
import styles from "./field.module.css";

export interface FieldOptions {
  label: string;
  /** Keep the accessible label while another layout supplies the visible text. */
  labelHidden?: boolean;
  description?: string;
  error?: string;
}
export type FieldVariant = "filled" | "outline";
interface FieldIds {
  id: string;
  descriptionId: string;
  errorId: string;
  describedBy: string | undefined;
}
export const useFieldIds = (
  id: string | undefined,
  description: string | undefined,
  error: string | undefined,
  describedBy: string | undefined,
): FieldIds => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  return {
    id: fieldId,
    descriptionId,
    errorId,
    describedBy:
      [describedBy, description && descriptionId, error && errorId]
        .filter(Boolean)
        .join(" ") || undefined,
  };
};
interface FieldProps extends FieldOptions {
  ids: FieldIds;
  children: ReactNode;
  inline?: boolean;
}
export const Field = ({
  label,
  labelHidden = false,
  description,
  error,
  ids,
  inline = false,
  children,
}: FieldProps): ReactElement => (
  <div className={styles.field} data-inline={inline}>
    {inline && children}
    <label
      className={labelHidden ? styles.visuallyHidden : styles.label}
      htmlFor={ids.id}
    >
      {label}
    </label>
    {!inline && children}
    {description && (
      <p className={styles.description} id={ids.descriptionId}>
        {description}
      </p>
    )}
    {error && (
      <p className={styles.error} id={ids.errorId}>
        {error}
      </p>
    )}
  </div>
);
