import { useCallback, useLayoutEffect, useRef } from "react";
import type { ComponentPropsWithRef, ReactElement } from "react";
import { useMergeRefs } from "@floating-ui/react";
import { cx } from "../../lib/classes.js";
import { Field, useFieldIds } from "../field/field.js";
import type { FieldOptions, FieldVariant } from "../field/field.js";
import styles from "../field/field.module.css";

export interface TextareaProps
  extends ComponentPropsWithRef<"textarea">, FieldOptions {
  variant?: FieldVariant;
  autoResize?: boolean;
  /** Allow manual vertical resizing; disabled by default and while autoResize is active. */
  resizable?: boolean;
  maxRows?: number;
}
export const Textarea = ({
  label,
  labelHidden,
  description,
  error,
  id,
  className,
  rows = 3,
  variant = "filled",
  autoResize = false,
  resizable = false,
  maxRows,
  ref,
  onInput,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: TextareaProps): ReactElement => {
  const ids = useFieldIds(id, description, error, describedBy);
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = useMergeRefs([ref, internalRef]);
  const resize = useCallback((): void => {
    if (!autoResize || !internalRef.current) return;
    const element = internalRef.current;
    element.style.height = "auto";
    const computed = getComputedStyle(element);
    const lineHeight = Number.parseFloat(computed.lineHeight) || 20;
    const vertical =
      (Number.parseFloat(computed.paddingTop) || 0) +
      (Number.parseFloat(computed.paddingBottom) || 0) +
      (Number.parseFloat(computed.borderTopWidth) || 0) +
      (Number.parseFloat(computed.borderBottomWidth) || 0);
    const limit = maxRows
      ? lineHeight * maxRows + vertical
      : Number.POSITIVE_INFINITY;
    const height = Math.min(element.scrollHeight, limit);
    if (height > 0) element.style.height = `${String(height)}px`;
    element.style.overflowY = element.scrollHeight > limit ? "auto" : "hidden";
  }, [autoResize, maxRows]);
  useLayoutEffect(() => {
    if (autoResize) {
      resize();
    } else if (internalRef.current) {
      internalRef.current.style.height = "";
      internalRef.current.style.overflowY = "";
    }
  }, [autoResize, resize, props.value, rows]);
  useLayoutEffect(() => {
    if (!autoResize) return;
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [autoResize, resize]);
  return (
    <Field
      label={label}
      labelHidden={labelHidden ?? false}
      ids={ids}
      {...(description !== undefined && { description })}
      {...(error !== undefined && { error })}
    >
      <textarea
        {...props}
        ref={mergedRef}
        onInput={(event) => {
          onInput?.(event);
          resize();
        }}
        rows={rows}
        data-variant={variant}
        data-auto-resize={autoResize}
        data-resizable={resizable}
        id={ids.id}
        className={cx(styles.control, className)}
        aria-describedby={ids.describedBy}
        aria-invalid={error ? true : invalid}
      />
    </Field>
  );
};
