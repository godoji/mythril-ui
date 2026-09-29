import { createContext, useContext, useId, useRef } from "react";
import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FloatingBoundary } from "../../lib/floating-position.js";
import { cx } from "../../lib/classes.js";
import { useControllable } from "../../lib/use-controllable.js";
import { IconButton } from "../icon-button/icon-button.js";
import { Tooltip } from "../tooltip/tooltip.js";
import { Popover } from "../popover/popover.js";
import styles from "./navigation.module.css";

const NavigationContext = createContext<"rail" | "sidebar">("sidebar");
const NavigationDismissContext = createContext<() => void>(() => {});
export interface NavigationProps extends ComponentPropsWithRef<"nav"> {
  label: string;
  variant?: "rail" | "sidebar";
}
/** Navigation landmark; links retain ordinary Tab and browser navigation behavior. */
export const Navigation = ({
  label,
  variant = "sidebar",
  className,
  ...props
}: NavigationProps): ReactElement => (
  <NavigationContext.Provider value={variant}>
    <nav
      {...props}
      aria-label={label}
      data-variant={variant}
      className={cx(styles.navigation, className)}
    />
  </NavigationContext.Provider>
);

interface ItemOptions {
  label: string;
  icon?: LucideIcon;
  current?: boolean;
  badge?: ReactNode;
  /** Pan a clipped label on hover or focus instead of wrapping it. */
  labelOverflow?: "wrap" | "marquee";
}
export interface NavigationLinkProps
  extends ComponentPropsWithRef<"a">, ItemOptions {
  href: string;
  /** Compact sidebar rows to match small buttons; rail targets retain their size. */
  size?: "default" | "small";
  /** Render a router Link, forwarding supplied props, ref and children. */
  renderLink?: (props: ComponentPropsWithRef<"a">) => ReactElement;
}
export interface NavigationRowProps {
  children: ReactNode;
  trailing: ReactNode;
}
/** Keep trailing controls beside a link or action, rather than nesting them inside it. */
export const NavigationRow = ({
  children,
  trailing,
}: NavigationRowProps): ReactElement => (
  <div className={styles.row}>
    {children}
    <span className={styles.rowTrailing}>{trailing}</span>
  </div>
);
const ItemContent = ({
  label,
  icon: Icon,
  badge,
  labelOverflow = "wrap",
}: ItemOptions): ReactElement => {
  const rail = useContext(NavigationContext) === "rail";
  return (
    <>
      {Icon && <Icon size={16} aria-hidden="true" />}
      {!Icon && rail && <span aria-hidden="true">{label.slice(0, 1)}</span>}
      <span
        className={cx(
          styles.label,
          labelOverflow === "marquee" && styles.marquee,
        )}
      >
        {labelOverflow === "marquee" ? (
          <span className={styles.marqueeText}>{label}</span>
        ) : (
          label
        )}
      </span>
      {badge !== undefined && <span className={styles.badge}>{badge}</span>}
    </>
  );
};
export const NavigationLink = ({
  label,
  icon,
  badge,
  labelOverflow = "wrap",
  size = "default",
  current = false,
  renderLink,
  className,
  ...props
}: NavigationLinkProps): ReactElement => {
  const rail = useContext(NavigationContext) === "rail";
  const dismiss = useContext(NavigationDismissContext);
  const anchorProps = {
    ...props,
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      props.onClick?.(event);
      if (!event.defaultPrevented) dismiss();
    },
    "aria-label": rail ? label : props["aria-label"],
    "aria-current": current ? "page" : props["aria-current"],
    "data-rail": rail,
    "data-size": size,
    className: cx(styles.item, className),
    children: (
      <ItemContent
        label={label}
        {...(icon && { icon })}
        badge={badge}
        labelOverflow={labelOverflow}
      />
    ),
  } satisfies ComponentPropsWithRef<"a"> & {
    "data-rail": boolean;
    "data-size": "default" | "small";
  };
  const link = renderLink ? (
    renderLink(anchorProps)
  ) : (
    <a {...anchorProps}>{anchorProps.children}</a>
  );
  return rail ? (
    <Tooltip label={label} placement="right">
      {link}
    </Tooltip>
  ) : (
    link
  );
};
export interface NavigationActionProps
  extends ComponentPropsWithRef<"button">, ItemOptions {}
export const NavigationAction = ({
  label,
  icon,
  badge,
  labelOverflow = "wrap",
  current = false,
  className,
  type = "button",
  ...props
}: NavigationActionProps): ReactElement => {
  const rail = useContext(NavigationContext) === "rail";
  const dismiss = useContext(NavigationDismissContext);
  const button = (
    <button
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) dismiss();
      }}
      type={type}
      data-rail={rail}
      aria-label={rail ? label : props["aria-label"]}
      aria-current={current ? "page" : undefined}
      className={cx(styles.item, className)}
    >
      <ItemContent
        label={label}
        {...(icon && { icon })}
        badge={badge}
        labelOverflow={labelOverflow}
      />
    </button>
  );
  return rail ? (
    <Tooltip label={label} placement="right" disabled={props.disabled ?? false}>
      {button}
    </Tooltip>
  ) : (
    button
  );
};
export interface NavigationGroupProps extends ItemOptions {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  boundary?: FloatingBoundary | null;
}
/** Sidebar disclosure or rail flyout, with the same child link composition. */
export const NavigationGroup = ({
  label,
  icon,
  badge,
  labelOverflow = "wrap",
  current = false,
  children,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  boundary,
}: NavigationGroupProps): ReactElement => {
  const rail = useContext(NavigationContext) === "rail";
  const [open, setOpen] = useControllable(
    controlled,
    defaultOpen,
    onOpenChange,
  );
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inheritedDismiss = useContext(NavigationDismissContext);
  const contents = (
    <NavigationContext.Provider value="sidebar">
      <NavigationDismissContext.Provider
        value={() => {
          if (rail) setOpen(false);
          inheritedDismiss();
        }}
      >
        <div className={styles.groupItems}>{children}</div>
      </NavigationDismissContext.Provider>
    </NavigationContext.Provider>
  );
  const trigger = (
    <button
      ref={triggerRef}
      type="button"
      className={styles.item}
      data-rail={rail}
      data-current={current}
      aria-label={rail ? label : undefined}
      aria-expanded={open}
      aria-controls={!rail && open ? id : undefined}
      onClick={
        rail
          ? undefined
          : () => {
              setOpen(!open);
            }
      }
    >
      <ItemContent
        label={label}
        {...(icon && { icon })}
        badge={badge}
        labelOverflow={labelOverflow}
      />
      <ChevronDown size={14} aria-hidden="true" className={styles.chevron} />
    </button>
  );
  if (rail)
    return (
      <Popover
        label={label}
        trigger={
          <IconButton
            icon={icon ?? ChevronDown}
            label={label}
            ref={triggerRef}
            tooltipPlacement="right"
            className={styles.item}
            data-current={current}
            aria-expanded={open}
          />
        }
        open={open}
        onOpenChange={setOpen}
        placement="right-start"
        boundary={boundary ?? null}
        openOn="click"
      >
        <strong>{label}</strong>
        {contents}
      </Popover>
    );
  return (
    // Escape bubbles from the group's native controls; the group itself is not interactive.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="group"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      {trigger}
      {open && <div id={id}>{contents}</div>}
    </div>
  );
};
