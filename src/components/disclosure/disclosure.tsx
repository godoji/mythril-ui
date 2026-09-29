import { useId } from "react";
import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cx } from "../../lib/classes.js";
import { useControllable } from "../../lib/use-controllable.js";
import styles from "./disclosure.module.css";

export interface DisclosureProps extends Omit<
  ComponentPropsWithRef<"div">,
  "title"
> {
  title: ReactNode;
  /** Secondary text aligned at the end of the trigger. */
  trailing?: ReactNode;
  /** Text keeps the trigger flush with its content and uses an underline hover. */
  variant?: "button" | "text";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const Disclosure = ({
  title,
  trailing,
  variant = "button",
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  className,
  ...props
}: DisclosureProps): ReactElement => {
  const [open, setOpen] = useControllable(
    controlled,
    defaultOpen,
    onOpenChange,
  );
  const id = useId();
  return (
    <div {...props} className={cx(styles.disclosure, className)}>
      <button
        type="button"
        className={styles.trigger}
        data-variant={variant}
        aria-expanded={open}
        aria-controls={id}
        disabled={disabled}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <span className={styles.title}>{title}</span>
        <ChevronRight size={14} aria-hidden="true" className={styles.chevron} />
        {trailing && <span className={styles.trailing}>{trailing}</span>}
      </button>
      <div id={id} className={styles.content} hidden={!open}>
        {children}
      </div>
    </div>
  );
};
