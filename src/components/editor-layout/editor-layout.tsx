import { useId } from "react";
import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { cx } from "../../lib/classes.js";
import styles from "./editor-layout.module.css";

export interface PageHeaderProps extends Omit<
  ComponentPropsWithRef<"header">,
  "title"
> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}
export const PageHeader = ({
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps): ReactElement => (
  <header {...props} className={cx(styles.pageHeader, className)}>
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </header>
);

export interface CardProps extends Omit<
  ComponentPropsWithRef<"section">,
  "title"
> {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}
export const Card = ({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: CardProps): ReactElement => {
  const titleId = useId();
  return (
    <section
      {...props}
      aria-labelledby={title ? titleId : props["aria-labelledby"]}
      className={cx(styles.card, className)}
    >
      {(title || description || actions) && (
        <div className={styles.cardHeader}>
          <div>
            {title && <h2 id={titleId}>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export interface FormRowProps extends ComponentPropsWithRef<"div"> {
  label: string;
  htmlFor?: string;
  hint?: string;
}
/** Form layout row; pass htmlFor when its child is a native input. */
export const FormRow = ({
  label,
  htmlFor,
  hint,
  children,
  className,
  ...props
}: FormRowProps): ReactElement => (
  <div {...props} className={cx(styles.formRow, className)}>
    <div className={styles.formLabel}>
      {htmlFor ? (
        <label htmlFor={htmlFor}>{label}</label>
      ) : (
        <span aria-hidden="true">{label}</span>
      )}
      {hint && <small>{hint}</small>}
    </div>
    <div className={styles.formContent}>{children}</div>
  </div>
);

export interface FormActionsProps extends ComponentPropsWithRef<"div"> {
  align?: "start" | "end" | "between";
}
export const FormActions = ({
  align = "start",
  className,
  ...props
}: FormActionsProps): ReactElement => (
  <div
    {...props}
    data-align={align}
    className={cx(styles.formActions, className)}
  />
);

export interface FilterBarProps extends ComponentPropsWithRef<"div"> {
  label: string;
  actions?: ReactNode;
}
/** Layout only; the application owns query state and URL synchronization. */
export const FilterBar = ({
  label,
  actions,
  children,
  className,
  ...props
}: FilterBarProps): ReactElement => (
  <div
    {...props}
    role="group"
    aria-label={label}
    className={cx(styles.filterBar, className)}
  >
    <div className={styles.filters}>{children}</div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </div>
);
