import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, InvalidEvent, ReactElement } from "react";
import { Tabs } from "../tabs/tabs.js";
import { TextInput } from "../text-input/text-input.js";
import { Textarea } from "../textarea/textarea.js";
import { useControllable } from "../../lib/use-controllable.js";

export interface FieldLocale {
  code: string;
  label: string;
  required?: boolean;
}
export interface LocalizedFieldProps {
  label: string;
  locales: readonly FieldLocale[];
  values: Readonly<Record<string, string>>;
  onValueChange: (locale: string, value: string) => void;
  activeLocale?: string;
  defaultLocale?: string;
  onActiveLocaleChange?: (locale: string) => void;
  errors?: Readonly<Record<string, string>>;
  description?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  /** Native names use name[locale]; all locale values submit even when their panel is hidden. */
  name?: string;
  completeLabel?: string;
  emptyLabel?: string;
  errorLabel?: string;
  className?: string;
}
/** Controlled multilingual input; the application supplies locales and stores values. */
export const LocalizedField = ({
  label,
  locales,
  values,
  onValueChange,
  activeLocale,
  defaultLocale,
  onActiveLocaleChange,
  errors,
  description,
  multiline = false,
  rows = 3,
  disabled = false,
  name,
  completeLabel = "Complete",
  emptyLabel = "Empty",
  errorLabel = "Error",
  className,
}: LocalizedFieldProps): ReactElement => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, { value: string; message: string }>
  >({});
  const invalidFrame = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (invalidFrame.current !== null)
        cancelAnimationFrame(invalidFrame.current);
    },
    [],
  );
  const [active, setActive] = useControllable(
    activeLocale,
    defaultLocale ?? locales[0]?.code ?? "",
    onActiveLocaleChange,
  );
  return (
    <Tabs
      label={label}
      value={active}
      onValueChange={setActive}
      variant="segmented"
      {...(className !== undefined && { className })}
      items={locales.map((locale) => {
        const value = values[locale.code] ?? "";
        const validationError = validationErrors[locale.code];
        const error =
          errors?.[locale.code] ??
          (locale.required && validationError?.value === value
            ? validationError.message
            : undefined);
        const field = {
          label: `${label} (${locale.label})`,
          value,
          disabled,
          required: locale.required,
          ...(name !== undefined && { name: `${name}[${locale.code}]` }),
          ...(error !== undefined && { error }),
          ...(description !== undefined && { description }),
          onInvalid: (
            event: InvalidEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            // Reveal the first invalid locale before focusing its hidden panel's input.
            event.preventDefault();
            const input = event.currentTarget;
            setValidationErrors((previous) => ({
              ...previous,
              [locale.code]: {
                value: input.value,
                message: input.validationMessage,
              },
            }));
            if (invalidFrame.current !== null) return;
            setActive(locale.code);
            invalidFrame.current = requestAnimationFrame(() => {
              invalidFrame.current = null;
              input.focus();
            });
          },
          onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            onValueChange(locale.code, event.currentTarget.value);
          },
        };
        return {
          value: locale.code,
          label: `${locale.label} · ${error ? errorLabel : value.trim() ? completeLabel : emptyLabel}`,
          content: multiline ? (
            <Textarea {...field} rows={rows} autoResize />
          ) : (
            <TextInput {...field} />
          ),
        };
      })}
    />
  );
};
