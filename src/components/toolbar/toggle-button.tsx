import type { MouseEvent, ReactElement, ReactNode } from "react";
import { Button } from "../button/button.js";
import type { ButtonProps } from "../button/button.js";
import { useControllable } from "../../lib/use-controllable.js";
import { cx } from "../../lib/classes.js";
import styles from "./toolbar.module.css";

export interface ToggleButtonProps extends Omit<ButtonProps, "aria-pressed"> {
  children: ReactNode;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

/** A native button with controlled or uncontrolled pressed state. */
export const ToggleButton = ({
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  onClick,
  disabled,
  variant = "ghost",
  className,
  ...props
}: ToggleButtonProps): ReactElement => {
  const [pressed, setPressed] = useControllable(
    controlledPressed,
    defaultPressed,
    onPressedChange,
  );
  return (
    <Button
      {...props}
      className={cx(styles.toggle, className)}
      variant={variant}
      disabled={disabled}
      aria-pressed={pressed}
      onClick={(event: MouseEvent<HTMLButtonElement>): void => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) setPressed(!pressed);
      }}
    />
  );
};
