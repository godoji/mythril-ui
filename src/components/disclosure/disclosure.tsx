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
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export const Disclosure = ({
  title,
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
        aria-expanded={open}
        aria-controls={id}
        disabled={disabled}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <ChevronRight size={14} aria-hidden="true" className={styles.chevron} />
        {title}
      </button>
      <div id={id} className={styles.content} hidden={!open}>
        {children}
      </div>
    </div>
  );
};
