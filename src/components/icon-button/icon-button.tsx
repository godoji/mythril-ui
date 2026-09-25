import type { ReactElement } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "../button/button.js";
import type { ButtonProps } from "../button/button.js";
import { Tooltip } from "../tooltip/tooltip.js";
import type { FloatingBoundary } from "../../lib/floating-position.js";
import { cx } from "../../lib/classes.js";
import styles from "./icon-button.module.css";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "children" | "aria-label" | "title" | "iconPosition"
> {
  icon: LucideIcon;
  label: string;
  /** Optional boundary for the icon-only tooltip. */
  boundary?: FloatingBoundary | null;
}
export const IconButton = ({
  icon,
  label,
  className,
  variant = "ghost",
  disabled = false,
  boundary,
  ...props
}: IconButtonProps): ReactElement => (
  <Tooltip label={label} disabled={disabled} boundary={boundary ?? null}>
    <Button
      {...props}
      variant={variant}
      icon={icon}
      disabled={disabled}
      aria-label={label}
      className={cx(styles.iconButton, className)}
    />
  </Tooltip>
);
