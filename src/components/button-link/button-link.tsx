import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { ButtonProps } from "../button/button.js";
import { cx } from "../../lib/classes.js";
import styles from "../button/button.module.css";

export interface ButtonLinkStyleOptions {
  variant?: ButtonProps["variant"] | undefined;
  size?: ButtonProps["size"] | undefined;
  className?: string | undefined;
}

/** Apply button styling to a router Link without changing its link behavior. */
export const buttonLinkProps = ({
  variant = "secondary",
  size = "medium",
  className,
}: ButtonLinkStyleOptions = {}): {
  className: string;
  "data-variant": NonNullable<ButtonProps["variant"]>;
  "data-size": NonNullable<ButtonProps["size"]>;
} => ({
  className: cx(styles.button, className),
  "data-variant": variant,
  "data-size": size,
});

export interface ButtonLinkProps extends ComponentPropsWithRef<"a"> {
  href: string;
  children: ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  icon?: LucideIcon;
  iconPosition?: "start" | "end";
}

/** A styled native anchor for navigation and downloads. */
export const ButtonLink = ({
  variant,
  size,
  className,
  icon: Icon,
  iconPosition = "start",
  children,
  ...props
}: ButtonLinkProps): ReactElement => {
  const styled = buttonLinkProps({ variant, size, className });
  const glyph = Icon && (
    <Icon
      size={size === "small" ? 14 : 16}
      strokeWidth={1.8}
      className={styles.icon}
      aria-hidden="true"
    />
  );
  return (
    <a {...props} {...styled}>
      {iconPosition === "start" && glyph}
      {children}
      {iconPosition === "end" && glyph}
    </a>
  );
};
