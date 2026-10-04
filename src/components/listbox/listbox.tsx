import { useRef, useState } from "react";
import type { KeyboardEvent, ReactElement } from "react";
import { Check } from "lucide-react";
import { useControllable } from "../../lib/use-controllable.js";
import { useFormReset } from "../../lib/use-form-reset.js";
import { useNativeDisabled } from "../../lib/use-native-disabled.js";
import { cx } from "../../lib/classes.js";
import type { ComboboxOption } from "../combobox/combobox.js";
import styles from "./listbox.module.css";

export interface ListboxProps {
  label: string;
  options: readonly ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
}

/** A visible single-select list with roving focus and typeahead. */
export const Listbox = ({
  label,
  options,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  name,
  disabled = false,
  className,
}: ListboxProps): ReactElement => {
  const [value, setValue, resetValue] = useControllable(
    controlledValue,
    defaultValue,
    onValueChange,
  );
  const [focusedValue, setFocusedValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldDisabled = useNativeDisabled(inputRef, disabled);
  const enabled = fieldDisabled
    ? []
    : options.filter((option) => !option.disabled);
  const activeValue = enabled.some((option) => option.value === focusedValue)
    ? focusedValue
    : (enabled.find((option) => option.value === value)?.value ??
      enabled[0]?.value ??
      "");
  const refs = useRef(new Map<string, HTMLDivElement>());
  const searchRef = useRef({ text: "", at: 0 });
  useFormReset(inputRef, () => {
    resetValue();
    setFocusedValue(defaultValue);
    searchRef.current = { text: "", at: 0 };
  });
  const focusOption = (next: string): void => {
    setFocusedValue(next);
    refs.current.get(next)?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (disabled || inputRef.current?.matches(":disabled")) return;
    const index = enabled.findIndex((option) => option.value === activeValue);
    if (index < 0) return;
    let next: ComboboxOption | undefined;
    if (event.key === "ArrowDown") next = enabled[(index + 1) % enabled.length];
    else if (event.key === "ArrowUp")
      next = enabled[(index - 1 + enabled.length) % enabled.length];
    else if (event.key === "Home") next = enabled[0];
    else if (event.key === "End") next = enabled.at(-1);
    else if (event.key === "Enter" || event.key === " ") {
      setValue(activeValue);
    } else if (
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      const text =
        (event.timeStamp - searchRef.current.at < 700
          ? searchRef.current.text
          : "") + event.key.toLocaleLowerCase();
      searchRef.current = { text, at: event.timeStamp };
      const ordered = [
        ...enabled.slice(index + 1),
        ...enabled.slice(0, index + 1),
      ];
      next = ordered.find((option) =>
        option.label.toLocaleLowerCase().startsWith(text),
      );
    } else return;
    event.preventDefault();
    if (next) focusOption(next.value);
  };
  return (
    <>
      <div
        role="listbox"
        aria-label={label}
        aria-disabled={fieldDisabled || undefined}
        className={cx(styles.listbox, className)}
      >
        {options.map((option) => (
          <div
            key={option.value}
            ref={(element) => {
              if (element) refs.current.set(option.value, element);
              else refs.current.delete(option.value);
            }}
            role="option"
            tabIndex={
              !fieldDisabled && !option.disabled && option.value === activeValue
                ? 0
                : -1
            }
            aria-selected={option.value === value}
            aria-disabled={fieldDisabled || option.disabled || undefined}
            className={styles.option}
            onFocus={() => {
              if (!fieldDisabled && !option.disabled)
                setFocusedValue(option.value);
            }}
            onKeyDown={onKeyDown}
            onClick={() => {
              if (
                disabled ||
                inputRef.current?.matches(":disabled") ||
                option.disabled
              )
                return;
              focusOption(option.value);
              setValue(option.value);
            }}
          >
            <span className={styles.text}>
              <span>{option.label}</span>
              {option.description && <small>{option.description}</small>}
            </span>
            {option.value === value && <Check size={14} aria-hidden="true" />}
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="hidden"
        name={name}
        value={value}
        disabled={disabled}
      />
    </>
  );
};
