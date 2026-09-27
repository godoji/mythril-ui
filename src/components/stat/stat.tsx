import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { cx } from "../../lib/classes.js";
import styles from "./stat.module.css";

export interface StatProps extends Omit<
  ComponentPropsWithRef<"div">,
  "children"
> {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}
/** Metric presentation; the caller formats values and determines what a change means. */
export const Stat = ({
  label,
  value,
  detail,
  tone = "neutral",
  className,
  ...props
}: StatProps): ReactElement => (
  <div {...props} className={cx(styles.stat, className)}>
    <dl>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </dl>
    {detail && (
      <div data-tone={tone} className={styles.detail}>
        {detail}
      </div>
    )}
  </div>
);

export interface ChartFrameProps extends ComponentPropsWithRef<"figure"> {
  label: string;
  description?: ReactNode;
  /** Accessible table or textual equivalent of the plotted values. */
  summary: ReactNode;
  summaryLabel?: string;
}
/** Chart surface with theme tokens and an accessible data alternative; accepts any chart renderer. */
export const ChartFrame = ({
  label,
  description,
  summary,
  summaryLabel = "View chart data",
  children,
  className,
  ...props
}: ChartFrameProps): ReactElement => (
  <figure {...props} className={cx(styles.chart, className)}>
    <figcaption>
      <strong>{label}</strong>
      {description && <div className={styles.detail}>{description}</div>}
    </figcaption>
    <div className={styles.plot}>{children}</div>
    <details>
      <summary>{summaryLabel}</summary>
      {summary}
    </details>
  </figure>
);
