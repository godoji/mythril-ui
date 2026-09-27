import type {
  ComponentPropsWithRef,
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";
import { cx } from "../../lib/classes.js";
import type { SpaceToken } from "../../lib/spacing.js";
import styles from "./page-layout.module.css";

export interface PageContainerProps extends ComponentPropsWithRef<"div"> {
  width?: "reading" | "standard" | "wide" | "full";
  padding?: SpaceToken;
}
/** Centered page content with consistent gutters. */
export const PageContainer = ({
  width = "standard",
  padding = "4",
  className,
  style,
  ...props
}: PageContainerProps): ReactElement => (
  <div
    {...props}
    data-width={width}
    className={cx(styles.page, className)}
    style={{
      ...style,
      padding: `var(--mythril-space-${padding}, ${String(Number(padding) * 0.25)}rem)`,
    }}
  />
);

export interface GridProps extends ComponentPropsWithRef<"div"> {
  /** Preferred minimum column width; columns collapse to fit the container. */
  minColumnWidth?: CSSProperties["width"];
  gap?: SpaceToken;
}
/** Responsive grid without viewport-specific application breakpoints. */
export const Grid = ({
  minColumnWidth = "18rem",
  gap = "4",
  className,
  style,
  ...props
}: GridProps): ReactElement => (
  <div
    {...props}
    className={cx(styles.grid, className)}
    style={{
      ...style,
      gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${typeof minColumnWidth === "number" ? `${String(minColumnWidth)}px` : minColumnWidth}), 1fr))`,
      gap: `var(--mythril-space-${gap}, ${String(Number(gap) * 0.25)}rem)`,
    }}
  />
);

export interface LinkCardProps extends ComponentPropsWithRef<"a"> {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Router adapter: forward all supplied anchor props and children. */
  renderLink?: (props: ComponentPropsWithRef<"a">) => ReactElement;
}
/** Entire-card anchor preserving native navigation and modified clicks. */
export const LinkCard = ({
  title,
  description,
  icon,
  renderLink,
  children,
  className,
  ...props
}: LinkCardProps): ReactElement => {
  const anchorProps = {
    ...props,
    className: cx(styles.linkCard, className),
    children: (
      <>
        {icon && <span aria-hidden="true">{icon}</span>}
        <strong>{title}</strong>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
        {children}
      </>
    ),
  };
  return renderLink ? (
    renderLink(anchorProps)
  ) : (
    <a {...anchorProps}>{anchorProps.children}</a>
  );
};
