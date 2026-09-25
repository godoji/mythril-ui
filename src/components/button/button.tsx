import type { ComponentPropsWithRef, ReactElement } from "react";
import type { LucideIcon } from "lucide-react";
import styles from "./button.module.css";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  /** Visual emphasis; this does not change the button's native behavior. */
  variant?:
    "primary" | "secondary" | "ghost" | "success" | "warning" | "danger";
  size?: "small" | "medium";
  /** Decorative icon displayed alongside the button label. Use IconButton for icon-only actions. */
  icon?: LucideIcon;
  iconPosition?: "start" | "end";
}

/** A native button that defaults to a non-submitting action. */
export const Button = ({
  variant = "secondary",
  size = "medium",
  type = "button",
  className,
  icon: Icon,
  iconPosition = "start",
  children,
  ...props
}: ButtonProps): ReactElement => (
  <button
    {...props}
    type={type}
    className={[styles.button, className].filter(Boolean).join(" ")}
    data-variant={variant}
    data-size={size}
  >
    {Icon && iconPosition === "start" && (
      <Icon
        size={size === "small" ? 14 : 16}
        strokeWidth={1.8}
        className={styles.icon}
        aria-hidden="true"
        focusable="false"
      />
    )}
    {children}
    {Icon && iconPosition === "end" && (
      <Icon
        size={size === "small" ? 14 : 16}
        strokeWidth={1.8}
        className={styles.icon}
        aria-hidden="true"
        focusable="false"
      />
    )}
  </button>
);
