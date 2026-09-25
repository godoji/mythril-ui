import { useId } from "react";
import type { ReactElement } from "react";
import styles from "./usage-meter.module.css";

export interface UsageMeterProps {
  label: string;
  /** null means usage is unavailable; zero is a known empty value. */
  value: number | null;
  max: number;
  unit?: string;
  formatValue?: (value: number) => string;
}
const formatNumber = (value: number): string => value.toLocaleString();
export const UsageMeter = ({
  label,
  value,
  max,
  unit,
  formatValue = formatNumber,
}: UsageMeterProps): ReactElement => {
  const id = useId();
  const known =
    value !== null &&
    Number.isFinite(value) &&
    value >= 0 &&
    Number.isFinite(max) &&
    max > 0;
  const ratio = known ? Math.min(value / max, 1) : 0;
  const text = known
    ? `${formatValue(value)} / ${formatValue(max)}${unit ? ` ${unit}` : ""}`
    : "Unavailable";
  return (
    <div className={styles.meter} data-known={known}>
      <div className={styles.labels}>
        <span id={id}>{label}</span>
        <span>{text}</span>
      </div>
      {known ? (
        <div
          role="meter"
          aria-labelledby={id}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={Math.min(value, max)}
          aria-valuetext={text}
          className={styles.track}
          data-tone={
            ratio >= 1 ? "danger" : ratio >= 0.8 ? "warning" : "neutral"
          }
        >
          <span
            className={styles.fill}
            style={{ width: `${String(ratio * 100)}%` }}
          />
        </div>
      ) : (
        <div className={styles.track} aria-hidden="true" />
      )}
    </div>
  );
};
