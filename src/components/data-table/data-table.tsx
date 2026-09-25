import type {
  ComponentPropsWithRef,
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";
import { cx } from "../../lib/classes.js";
import styles from "./data-table.module.css";

export interface DataTableProps extends ComponentPropsWithRef<"table"> {
  caption: string;
  density?: "compact" | "comfortable";
  stickyHeader?: boolean;
  minWidth?: CSSProperties["minWidth"];
  maxHeight?: CSSProperties["maxHeight"];
  viewportClassName?: string;
}

/** Scrollable semantic table; the application supplies rows and data operations. */
export const DataTable = ({
  caption,
  density = "compact",
  stickyHeader = false,
  minWidth,
  maxHeight,
  viewportClassName,
  className,
  style,
  children,
  ...props
}: DataTableProps): ReactElement => (
  <div className={cx(styles.viewport, viewportClassName)} style={{ maxHeight }}>
    <table
      {...props}
      className={cx(styles.table, className)}
      data-density={density}
      data-sticky-header={stickyHeader}
      style={{ ...style, ...(minWidth !== undefined && { minWidth }) }}
    >
      <caption className={styles.caption}>{caption}</caption>
      {children}
    </table>
  </div>
);

interface ColumnOptions {
  align?: "start" | "center" | "end";
  hideBelow?: "small" | "medium" | "large";
}
export interface DataTableHeadCellProps
  extends Omit<ComponentPropsWithRef<"th">, "align">, ColumnOptions {
  sortDirection?: "ascending" | "descending" | "none";
  onSort?: () => void;
}
export const DataTableHeadCell = ({
  align,
  hideBelow,
  sortDirection,
  onSort,
  children,
  className,
  ...props
}: DataTableHeadCellProps): ReactElement => (
  <th
    {...props}
    scope={props.scope ?? "col"}
    aria-sort={sortDirection}
    data-align={align}
    data-hide-below={hideBelow}
    className={cx(styles.cell, className)}
  >
    {onSort ? (
      <button type="button" className={styles.sortButton} onClick={onSort}>
        {children}
      </button>
    ) : (
      children
    )}
  </th>
);

export interface DataTableCellProps
  extends Omit<ComponentPropsWithRef<"td">, "align">, ColumnOptions {}
export const DataTableCell = ({
  align,
  hideBelow,
  className,
  ...props
}: DataTableCellProps): ReactElement => (
  <td
    {...props}
    data-align={align}
    data-hide-below={hideBelow}
    className={cx(styles.cell, className)}
  />
);

export interface DataTableStateRowProps {
  colSpan: number;
  children: ReactNode;
}
export const DataTableStateRow = ({
  colSpan,
  children,
}: DataTableStateRowProps): ReactElement => (
  <tr>
    <td colSpan={colSpan} className={styles.state}>
      {children}
    </td>
  </tr>
);
