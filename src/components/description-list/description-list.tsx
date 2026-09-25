import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { cx } from "../../lib/classes.js";
import styles from "./description-list.module.css";

export interface DescriptionItem {
  label: string;
  value: ReactNode;
}
export interface DescriptionListProps extends Omit<
  ComponentPropsWithRef<"dl">,
  "children"
> {
  items: readonly DescriptionItem[];
  density?: "compact" | "comfortable";
}
/** Semantic label/value rows for read-only detail pages. */
export const DescriptionList = ({
  items,
  density = "compact",
  className,
  ...props
}: DescriptionListProps): ReactElement => (
  <dl {...props} data-density={density} className={cx(styles.list, className)}>
    {items.map((item) => (
      <div className={styles.row} key={item.label}>
        <dt>{item.label}</dt>
        <dd>{item.value ?? "—"}</dd>
      </div>
    ))}
  </dl>
);
