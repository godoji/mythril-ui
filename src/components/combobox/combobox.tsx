import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, ReactElement, Ref } from "react";
import {
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
} from "@floating-ui/react";
import type { Placement } from "@floating-ui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useControllable } from "../../lib/use-controllable.js";
import { useFormReset } from "../../lib/use-form-reset.js";
import { useNativeDisabled } from "../../lib/use-native-disabled.js";
import { cx } from "../../lib/classes.js";
import {
  floatingAutoUpdate,
  floatingMiddleware,
} from "../../lib/floating-position.js";
import type { FloatingBoundary } from "../../lib/floating-position.js";
import { Field, useFieldIds } from "../field/field.js";
import type { FieldOptions, FieldVariant } from "../field/field.js";
import fieldStyles from "../field/field.module.css";
import { OverlayTheme } from "../theme/theme.js";
import { useComponentMessages } from "../messages/messages.js";
import styles from "./combobox.module.css";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
export interface ComboboxProps extends FieldOptions {
  options: readonly ComboboxOption[];
  /** Keep the current label available outside the current remote result page. */
  selectedOption?: ComboboxOption;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  filterMode?: "local" | "provided";
  loading?: boolean;
  loadingMessage?: string;
  onOptionSelect?: (option: ComboboxOption) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  variant?: FieldVariant;
  placement?: Placement;
  boundary?: FloatingBoundary | null;
  className?: string;
  ref?: Ref<HTMLInputElement>;
  "aria-describedby"?: string;
}

/** Filterable single selection with input focus and a collision-aware listbox. */
export const Combobox = ({
  label,
  labelHidden,
  description,
  error,
  options,
  selectedOption,
  query: controlledQuery,
  defaultQuery = "",
  onQueryChange,
  filterMode = "local",
  loading = false,
  loadingMessage,
  onOptionSelect,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  placeholder,
  emptyMessage,
  name,
  id,
  disabled = false,
  variant = "filled",
  placement = "bottom-start",
  boundary,
  className,
  ref,
  "aria-describedby": describedBy,
}: ComboboxProps): ReactElement => {
  const messages = useComponentMessages();
  const ids = useFieldIds(id, description, error, describedBy);
  const [value, setValue, resetValue] = useControllable(
    controlledValue,
    defaultValue,
    onValueChange,
  );
  const [query, setQuery, resetQuery] = useControllable(
    controlledQuery,
    defaultQuery,
    onQueryChange,
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selected =
    selectedOption?.value === value
      ? selectedOption
      : options.find((option) => option.value === value);
  const filtered = loading
    ? []
    : filterMode === "provided"
      ? options
      : options.filter((option) =>
          `${option.label} ${option.description ?? ""}`
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
        );
  const enabled = filtered.flatMap((option, index) =>
    option.disabled ? [] : [index],
  );
  const active = enabled.includes(activeIndex) ? activeIndex : enabled[0];
  const listId = `${ids.id}-listbox`;
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const unavailable = useNativeDisabled(inputRef, disabled);
  const expanded = open && !unavailable;
  if (unavailable && open) setOpen(false);
  useFormReset(inputRef, () => {
    resetValue();
    resetQuery();
    setOpen(false);
    setActiveIndex(0);
  });
  const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
    open: expanded,
    onOpenChange: setOpen,
    placement,
    strategy: "fixed",
    middleware: floatingMiddleware(4, boundary, "end"),
    whileElementsMounted: floatingAutoUpdate(boundary),
  });
  const setReference = useCallback(
    (node: HTMLInputElement | null): void => {
      refs.setReference(node);
    },
    [refs],
  );
  const setFloating = useCallback(
    (node: HTMLDivElement | null): void => {
      listboxRef.current = node;
      refs.setFloating(node);
    },
    [refs],
  );
  useLayoutEffect(() => {
    if (!open || active === undefined) return;
    listboxRef.current
      ?.querySelector<HTMLElement>(`[data-active="true"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active, options, query]);
  const mergedRef = useMergeRefs([inputRef, setReference, ref]);
  const dismiss = useDismiss(context, { escapeKey: false });
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);
  const referenceProps = getReferenceProps();
  const choose = (option: ComboboxOption): void => {
    if (disabled || inputRef.current?.matches(":disabled") || option.disabled)
      return;
    setValue(option.value);
    onOptionSelect?.(option);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (
      event.currentTarget.matches(":disabled") ||
      event.nativeEvent.isComposing ||
      // Legacy IME confirmation events can report 229 after composition ends.
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      event.nativeEvent.keyCode === 229
    )
      return;
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      setQuery("");
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setQuery("");
        setOpen(true);
        setActiveIndex(
          event.key === "ArrowDown"
            ? options.findIndex((option) => !option.disabled)
            : options.reduce(
                (last, option, index) => (option.disabled ? last : index),
                -1,
              ),
        );
      } else if (enabled.length) {
        const position = enabled.indexOf(active ?? -1);
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex(
          enabled[(position + direction + enabled.length) % enabled.length] ??
            0,
        );
      }
      return;
    }
    if (!open) return;
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(enabled[0] ?? 0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(enabled.at(-1) ?? 0);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = active === undefined ? undefined : filtered[active];
      if (option && !option.disabled) choose(option);
    }
  };
  return (
    <div className={cx(styles.root, className)}>
      <Field
        label={label}
        labelHidden={labelHidden ?? false}
        ids={ids}
        {...(description !== undefined && { description })}
        {...(error !== undefined && { error })}
      >
        <div className={styles.inputWrap}>
          <input
            {...referenceProps}
            onFocus={(event) => {
              if (!event.currentTarget.matches(":disabled")) {
                setQuery("");
                setActiveIndex(0);
                setOpen(true);
              }
            }}
            onClick={(event) => {
              if (!event.currentTarget.matches(":disabled") && !open) {
                setQuery("");
                setActiveIndex(0);
                setOpen(true);
              }
            }}
            onBlur={() => {
              setOpen(false);
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => {
              setQuery(event.currentTarget.value);
              setActiveIndex(0);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            ref={mergedRef}
            id={ids.id}
            role="combobox"
            type="text"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls={expanded ? listId : undefined}
            aria-activedescendant={
              expanded && active !== undefined
                ? `${listId}-option-${String(active)}`
                : undefined
            }
            aria-describedby={ids.describedBy}
            aria-invalid={Boolean(error)}
            data-variant={variant}
            className={cx(fieldStyles.control, styles.input)}
            placeholder={placeholder}
            disabled={disabled}
            value={open ? query : (selected?.label ?? "")}
          />
          <ChevronsUpDown
            size={14}
            aria-hidden="true"
            className={styles.icon}
          />
        </div>
      </Field>
      {name && (
        <input type="hidden" name={name} value={value} disabled={unavailable} />
      )}
      {expanded && (
        <FloatingPortal>
          <OverlayTheme>
            <div
              {...getFloatingProps()}
              ref={setFloating}
              id={listId}
              role="listbox"
              aria-label={label}
              aria-busy={loading}
              className={styles.listbox}
              style={floatingStyles}
            >
              {loading ? (
                <div className={styles.empty} role="status">
                  {loadingMessage ?? messages.loading}
                </div>
              ) : (
                filtered.length === 0 && (
                  <div className={styles.empty}>
                    {emptyMessage ?? messages.noResults}
                  </div>
                )
              )}
              {filtered.map((option, index) => (
                <div
                  key={option.value}
                  id={`${listId}-option-${String(index)}`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled || undefined}
                  data-active={index === active}
                  className={styles.option}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onMouseEnter={() => {
                    setActiveIndex(index);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !option.disabled)
                      choose(option);
                  }}
                  onClick={() => {
                    if (!option.disabled) choose(option);
                  }}
                >
                  <span className={styles.optionText}>
                    <span>{option.label}</span>
                    {option.description && <small>{option.description}</small>}
                  </span>
                  {option.value === value && (
                    <Check size={14} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </OverlayTheme>
        </FloatingPortal>
      )}
    </div>
  );
};
