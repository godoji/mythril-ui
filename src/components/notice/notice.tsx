import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { CircleCheck, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { cx } from "../../lib/classes.js";
import styles from "./notice.module.css";

export interface NoticeProps extends Omit<
  ComponentPropsWithRef<"div">,
  "title"
> {
  title?: string;
  tone?: "info" | "success" | "warning" | "danger";
  actions?: ReactNode;
}
/** Static by default. Use role="alert" for urgent, newly appearing feedback. */
export const Notice = ({
  title,
  tone = "info",
  actions,
  children,
  className,
  role = "note",
  ...props
}: NoticeProps): ReactElement => {
  const Icon = {
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    danger: CircleAlert,
  }[tone];
  return (
    <div
      {...props}
      role={role}
      data-tone={tone}
      className={cx(styles.notice, className)}
    >
      <Icon size={16} className={styles.icon} aria-hidden="true" />
      <div className={styles.body}>
        {title && <strong className={styles.title}>{title}</strong>}
        <div>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
};
export const Alert = (props: NoticeProps): ReactElement => (
  <Notice {...props} role="alert" />
);
