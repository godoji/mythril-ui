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
import { Check, Search } from "lucide-react";
import { useControllable } from "../../lib/use-controllable.js";
import { useFormReset } from "../../lib/use-form-reset.js";
import { useNativeDisabled } from "../../lib/use-native-disabled.js";
import { cx } from "../../lib/classes.js";
import {
  floatingAutoUpdate,
  floatingMiddleware,
} from "../../lib/floating-position.js";
import type { FloatingBoundary } from "../../lib/floating-position.js";
import type { ComboboxOption } from "../combobox/combobox.js";
import { Chip } from "../chip/chip.js";
import { Field, useFieldIds } from "../field/field.js";
import fieldStyles from "../field/field.module.css";
import { OverlayTheme } from "../theme/theme.js";
import type { FieldOptions } from "../field/field.js";
import { useComponentMessages } from "../messages/messages.js";
import styles from "./entity-picker.module.css";

export type EntityPickerOption = ComboboxOption;
export type EntityPickerLayout = "separate" | "inline";
export type EntityPickerFilterMode = "provided" | "prefix";
export interface EntityPickerProps extends FieldOptions {
  id?: string;
  ref?: Ref<HTMLInputElement>;
  "aria-describedby"?: string;
  selected: readonly EntityPickerOption[];
  options: readonly EntityPickerOption[];
  onSelectedChange: (selected: EntityPickerOption[]) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  loading?: boolean;
  disabled?: boolean;
  maxSelected?: number;
  placeholder?: string;
  emptyMessage?: string;
  name?: string;
  boundary?: FloatingBoundary | null;
  placement?: Placement;
  /** Put selected chips inside the input surface. */
  layout?: EntityPickerLayout;
  /** Filter local options by label prefix, or use caller-filtered options. */
  filterMode?: EntityPickerFilterMode;
  className?: string;
}

/** Searchable multi-selection; the application supplies matching options and selected labels. */
export const EntityPicker = ({
  label,
  labelHidden,
  id,
  ref,
  description,
  error,
  "aria-describedby": describedBy,
  selected,
  options,
  onSelectedChange,
  query: controlledQuery,
  defaultQuery = "",
  onQueryChange,
  loading = false,
  disabled = false,
  maxSelected,
  placeholder,
  emptyMessage,
  name,
  boundary,
  placement = "bottom-start",
  layout = "separate",
  filterMode = "provided",
  className,
}: EntityPickerProps): ReactElement => {
  const messages = useComponentMessages();
  const ids = useFieldIds(id, description, error, describedBy);
  const [query, setQuery, resetQuery] = useControllable(
    controlledQuery,
    defaultQuery,
    onQueryChange,
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const fieldDisabled = useNativeDisabled(inputRef, disabled);
  const expanded = open && !fieldDisabled;
  if (fieldDisabled && open) setOpen(false);
  useFormReset(inputRef, () => {
    resetQuery();
    setOpen(false);
    setActiveIndex(0);
  });
  const selectedIds = new Set(selected.map((item) => item.value));
  const availableOptions = loading
    ? []
    : filterMode === "prefix"
      ? options.filter(
          (option) =>
            !selectedIds.has(option.value) &&
            option.label
              .toLocaleLowerCase()
              .startsWith(query.trim().toLocaleLowerCase()),
        )
      : options;
  const unavailable = (option: EntityPickerOption): boolean =>
    option.disabled === true ||
    (maxSelected !== undefined &&
      selected.length >= maxSelected &&
      !selectedIds.has(option.value));
  const enabled = availableOptions.flatMap((option, index) =>
    unavailable(option) ? [] : [index],
  );
  const active = enabled.includes(activeIndex) ? activeIndex : enabled[0];
  const listId = `${ids.id}-results`;
  const { refs, floatingStyles, context } = useFloating<HTMLElement>({
    open: expanded,
    onOpenChange: setOpen,
    placement,
    strategy: "fixed",
    middleware: floatingMiddleware(4, boundary, "end"),
    whileElementsMounted: floatingAutoUpdate(boundary),
  });
  const setReference = useCallback(
    (element: HTMLInputElement | null): void => {
      if (layout === "separate") refs.setReference(element);
    },
    [layout, refs],
  );
  const mergedRef = useMergeRefs([inputRef, ref, setReference]);
  const dismiss = useDismiss(context, { escapeKey: false });
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);
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
  }, [open, active, options, query, selected]);
  const toggle = (option: EntityPickerOption): void => {
    if (
      disabled ||
      inputRef.current?.matches(":disabled") ||
      unavailable(option)
    )
      return;
    onSelectedChange(
      selectedIds.has(option.value)
        ? selected.filter((item) => item.value !== option.value)
        : [...selected, option],
    );
    if (filterMode === "prefix") {
      setQuery("");
      setActiveIndex(0);
    }
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
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setActiveIndex(
          event.key === "ArrowUp" ? (enabled.at(-1) ?? 0) : (enabled[0] ?? 0),
        );
        setOpen(true);
      } else if (enabled.length) {
        const index = enabled.indexOf(active ?? -1);
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex(
          enabled[(index + direction + enabled.length) % enabled.length] ?? 0,
        );
      }
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      if (active !== undefined && availableOptions[active])
        toggle(availableOptions[active]);
    } else if (event.key === "Backspace" && !query && selected.length) {
      onSelectedChange(selected.slice(0, -1));
    }
  };
  const selectedChips = selected.map((item) => (
    <Chip
      key={item.value}
      disabled={fieldDisabled}
      onRemove={() => {
        if (disabled || inputRef.current?.matches(":disabled")) return;
        onSelectedChange(
          selected.filter((entry) => entry.value !== item.value),
        );
        inputRef.current?.focus();
      }}
      removeLabel={messages.remove(item.label)}
    >
      {item.label}
    </Chip>
  ));
  return (
    <div className={cx(styles.root, className)}>
      <Field
        label={label}
        labelHidden={labelHidden ?? false}
        ids={ids}
        {...(description !== undefined && { description })}
        {...(error !== undefined && { error })}
      >
        <div
          className={styles.inputWrap}
          data-layout={layout}
          ref={(element) => {
            if (layout === "inline") refs.setReference(element);
          }}
        >
          {layout === "inline" && selectedChips}
          {layout === "separate" && (
            <Search
              size={14}
              aria-hidden="true"
              className={styles.searchIcon}
            />
          )}
          <input
            {...getReferenceProps()}
            ref={mergedRef}
            id={ids.id}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-describedby={ids.describedBy}
            aria-invalid={Boolean(error)}
            aria-expanded={expanded}
            aria-controls={expanded ? listId : undefined}
            aria-activedescendant={
              expanded && active !== undefined
                ? `${listId}-option-${String(active)}`
                : undefined
            }
            className={cx(fieldStyles.control, styles.input)}
            data-variant="filled"
            value={query}
            placeholder={placeholder ?? messages.search}
            disabled={disabled}
            onFocus={(event) => {
              if (!event.currentTarget.matches(":disabled")) setOpen(true);
            }}
            onClick={(event) => {
              if (!event.currentTarget.matches(":disabled") && !open)
                setOpen(true);
            }}
            onBlur={() => {
              setOpen(false);
            }}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setQuery(event.currentTarget.value);
              setActiveIndex(0);
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
          />
        </div>
      </Field>
      {layout === "separate" && selected.length > 0 && (
        <div className={styles.selected} aria-label={messages.selected(label)}>
          {selectedChips}
        </div>
      )}
      {name &&
        selected.map((item) => (
          <input
            key={item.value}
            type="hidden"
            name={name}
            value={item.value}
            disabled={fieldDisabled}
          />
        ))}
      {expanded && (
        <FloatingPortal>
          <OverlayTheme>
            <div
              {...getFloatingProps()}
              ref={setFloating}
              id={listId}
              role="listbox"
              aria-label={label}
              aria-multiselectable="true"
              className={styles.listbox}
              style={floatingStyles}
            >
              {loading ? (
                <div className={styles.message} role="status">
                  {messages.loading}
                </div>
              ) : availableOptions.length === 0 ? (
                <div className={styles.message}>
                  {emptyMessage ?? messages.noResults}
                </div>
              ) : (
                availableOptions.map((option, index) => (
                  <div
                    key={option.value}
                    id={`${listId}-option-${String(index)}`}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selectedIds.has(option.value)}
                    aria-disabled={unavailable(option) || undefined}
                    data-active={index === active}
                    className={styles.option}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    onMouseEnter={() => {
                      setActiveIndex(index);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggle(option);
                      }
                    }}
                    onClick={() => {
                      toggle(option);
                    }}
                  >
                    <span className={styles.optionText}>
                      <span>{option.label}</span>
                      {option.description && (
                        <small>{option.description}</small>
                      )}
                    </span>
                    {selectedIds.has(option.value) && (
                      <Check size={14} aria-hidden="true" />
                    )}
                  </div>
                ))
              )}
            </div>
          </OverlayTheme>
        </FloatingPortal>
      )}
    </div>
  );
};
